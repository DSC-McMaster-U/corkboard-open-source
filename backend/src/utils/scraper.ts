/* November 16th, 2025
 * This scarper utility is not complete, and is meant to be more proof of concept to be expanded later
 * As of now, it only support scrapigng text from the corktwon pub's list of events.
 * 
 * to run this file directly, use `node --loader ts-node/esm src/utils/scraper.ts` (from the backend directory)
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

      const start_time = new Date(Date.UTC(yyyy, mm, Number(dd), Number(hourStr), Number(minStr), 0));

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

//still need to check if events already exist before inserting
export async function insertScrapedEvents(events: Event[]) {
  const venueID = "204cc1c3-e141-4ba1-9e3f-bde3763149d2";

  function normalizeTitle(s: string) {
    return s.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function makeKey(venue_id: string, startIso: string, title: string) {
    return `${venue_id}|${startIso}|${normalizeTitle(title)}`;
  }

  if (!events.length) return;

  const times = events.map(event => event.start_time.toISOString()).sort();
  const minTime = times[0];
  const maxTime = times[times.length - 1];

  const existing = await eventService.getEventsForVenueInRange(venueID, minTime!, maxTime!);

  const existingEventKeys = new Set(
    existing.map((e: any) => makeKey(e.venue_id, new Date(e.start_time).toISOString(), e.title))
  );

  const now = new Date();

  for (const event of events) {
    const startIso = event.start_time.toISOString();
    const k = makeKey(venueID, startIso, event.title);

    if (existingEventKeys.has(k)) {
      console.log(`Skipping existing event: ${event.title}`);
      continue;
    }

    // don't add events that aren't in the future
    if (event.start_time <= now) {
      console.log(`Skipping past event: ${event.title} (${event.start_time.toISOString()})`);
      continue;
    }

    // check if artist exists, if not create, pass new artist id to event
    const artistRecord = await artistService.getOrCreateArtistByName(event.artist || event.title);
    const artistID = artistRecord?.id ?? null;

    await eventService.addEvent(
      event.title,
      venueID, 
      event.start_time.toISOString(),
      event.description,
      event.cost || null,
      "published",
      "scraping",
      event.source_url,
      "success",
      artistID,
      event.image
    );

    existingEventKeys.add(k);
    console.log(`Inserted event: ${event.title}`);
  }
}

if (data?.length) {
  try {
    await insertScrapedEvents(data);
  } catch (err) {
    console.error("Failed to insert events:", err);
  }
}

// const min_start_time = new Date();
// const max_start_time = new Date("2999-1-1");
// const min_cost = 0;
// const max_cost = 100;

// const data = await(eventService.getAllEvents(50, min_start_time.toISOString(), max_start_time.toISOString(), min_cost, max_cost));

// console.log(data);