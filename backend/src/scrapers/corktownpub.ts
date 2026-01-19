/* Jan 19th 2026
 * to run this file directly, use (from the backend directory)
 * `node --loader ts-node/esm src/scrapers/corktownpub.ts` 
 */

import axios from "axios";
import * as cheerio from "cheerio";
import { eventService } from "../services/eventService.js";
import e from "express";
import { artistService } from "../services/artistService.js";

type Event = {
  title: string;
  description: string;
  start_time: Date;
  cost?: number;
  source_url: string;
  image: string;
  artist?: string;
};

export async function scrapeWebsite(url: string) {
  try {
    //get the html
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    //load into Cheerio
    const cheerioObj = cheerio.load(html);

    //typescript moment
    const results: Event[] = [];

    cheerioObj("h4").each((_, el) => {
      // h4 element is the time, and then go up a div, go to the next and the strong is the stage and time
      const outerDiv = cheerioObj(el).parent().parent();
      const rawDate = cheerioObj(el).text().trim();
      // const stage = outerDiv.next("div").find("strong").first().text().trim();
      // const stage = "";
      let rawTimeAndStage = outerDiv.next("div").find("strong").first().text().trim();
      let timeAndStage = rawTimeAndStage.split(" – ");
      let description = timeAndStage[1] ?? "";
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/i;
      if (timeRegex.test(description))
        description = timeAndStage[2] ?? "";

      const rawTime = timeAndStage[0] ?? "";
      if (!rawTime) return;
      let [hourStr, minStr] = rawTime.split(":");
      if (!hourStr || !minStr) return;

      if (minStr.includes("12") && minStr.includes("am"))
        hourStr = "0";
      else if (minStr.includes("pm") && !minStr.includes("12")) {
        let hourTemp = Number(hourStr) + 12;
        hourStr = String(hourTemp);
      }

      minStr = minStr.replace(/(am|pm)/, "");


      // it is important to use the character U+2013 "–" in the regex, and not the regular hyphen "-"
      var tempTitle = outerDiv.next("div").first().text().trim();
      var regex = new RegExp(`^${rawTimeAndStage} – `);
      const title = tempTitle.replace(regex, "").trim()

      // construct start_time from date 
      let parts = rawDate.split(" ");
      let dd = parts[2]?.replace(/\D+/g, "") ?? 0;
      // if (!dd) continue;
      let yyyy = new Date().getFullYear();

      const monthDict = {
        'JANUARY': 0, 'FEBRUARY': 1, 'MARCH': 2,
        'APRIL': 3, 'MAY': 4, 'JUNE': 5,
        'JULY': 6, 'AUGUST': 7, 'SEPTEMBER': 8,
        'OCTOBER': 9, 'NOVEMBER': 10, 'DECEMBER': 11
      };
      const month = parts[1]?.toUpperCase() as keyof typeof monthDict;
      let mm = monthDict[month];
      // if (mm === undefined) return;

      const start_time = new Date(yyyy, mm, Number(dd), Number(hourStr), Number(minStr), 0);

      // No price on the website, so set a dummy price for now!
      //const cost = 10.00;
      const source_url = url

      results.push({ title: title, description: description, start_time: start_time, source_url: source_url, artist: title, image: "/images/events/corktown-pub.jpg" });
    });

    return results;

  } catch (err) {
    console.error("Scraping failed:", err);
    return [];
  }
}

const data = await scrapeWebsite("https://corktownpub.ca/on-the-stage/");
console.log(data);

export async function insertScrapedEvents(events: Event[]) {
  const venueID = "204cc1c3-e141-4ba1-9e3f-bde3763149d2";

  function normalizeTitle(s: string) {
    return s.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function pad2(n: number) {
    return String(n).padStart(2, "0");
  }

  function dateOnlyKey(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }
Date
  function makeKey(venue_id: string, startTime: Date, title: string) {
    return `${venue_id}|${dateOnlyKey(startTime)}|${normalizeTitle(title)}`;
  }

  if (!events.length) return;

  const minDate = new Date(Math.min(...events.map(e => e.start_time.getTime())));
  minDate.setDate(minDate.getDate() - 2);
  minDate.setHours(0, 0, 0, 0);

  const maxDate = new Date(Math.max(...events.map(e => e.start_time.getTime())));
  maxDate.setDate(maxDate.getDate() + 2);
  maxDate.setHours(23, 59, 59, 999);

  const existing = await eventService.getEventsForVenueInRange(
    venueID,
    minDate.toISOString(),
    maxDate.toISOString()
  );
  
  type ExistingEventRow = {
    id: string;
    venue_id: string;
    start_time: string;
    title: string;
    description: string | null;
    cost: number | null;
    source_url: string | null;
    artist_id: string | null;
    image: string | null;
    status: string | null;
    source_type: string | null;
    ingestion_status: string | null;
    };

  const existingByKey = new Map<string, ExistingEventRow>(); // key -> event row
  for (const e of existing as ExistingEventRow[]) {
    const key = makeKey(e.venue_id, new Date(e.start_time), e.title);
    existingByKey.set(key, e);
  }

  const now = new Date();

  for (const event of events) {
    const startIso = event.start_time.toISOString();
    const k = makeKey(venueID, event.start_time, event.title);

    // don't add events that aren't in the future
    if (event.start_time <= now) {
      console.log(`Skipping past event: ${event.title} (${event.start_time.toISOString()})`);
      continue;
    }

    // check if artist exists, if not create, pass new artist id to event
    const artistRecord = await artistService.getOrCreateArtistByName(event.artist || event.title);
    const artistID = artistRecord?.id ?? null;

    // if exists, update it
    const existingRow = existingByKey.get(k);
    const patch = {
        title: event.title,
        venue_id: venueID,
        start_time: startIso,
        description: normalizeNullableString(event.description),
        cost: event.cost ?? null,
        status: "published" as const,
        source_type: "scraping" as const,
        source_url: normalizeNullableString(event.source_url),
        ingestion_status: "success" as const,
        artist_id: artistID,
        image: normalizeNullableString(event.image),
    };
    if (existingRow) {
        const changed =
            existingRow.title !== patch.title ||
            new Date(existingRow.start_time).toISOString() !== patch.start_time ||
            normalizeNullableString(existingRow.description) !== patch.description ||
            !sameNullableNumber(existingRow.cost, patch.cost) ||
            normalizeNullableString(existingRow.source_url) !== patch.source_url ||
            (existingRow.artist_id ?? null) !== patch.artist_id ||
            normalizeNullableString(existingRow.image) !== patch.image ||
            (existingRow.status ?? null) !== patch.status ||
            (existingRow.source_type ?? null) !== patch.source_type ||
            (existingRow.ingestion_status ?? null) !== patch.ingestion_status;

        if (!changed) {
            console.log(`No changes: ${event.title}`);
            continue;
        }

        await eventService.updateEventByID(existingRow.id, patch);
        console.log(`Updated existing event: ${event.title}`);
    } else {  // else, insert new
        await eventService.addEvent(
            event.title,
            venueID, 
            event.start_time.toISOString(),
            event.description,
            event.cost ?? null,
            "published",
            "scraping",
            event.source_url,
            "success",
            artistID,
            event.image
        );
        //existingByKey.set(k, "placeholder");
        console.log(`Inserted event: ${event.title}`);
    }
  }
}

function normalizeNullableString(s: string | null | undefined) {
  const t = (s ?? "").trim();
  return t.length ? t : null;
}

function sameNullableNumber(a: number | null | undefined, b: number | null | undefined) {
  return (a ?? null) === (b ?? null);
}


if (data?.length) {
  try {
    await insertScrapedEvents(data);
  } catch (err) {
    console.error("Failed to insert events:", err);
  }
}
