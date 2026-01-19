/* Jan 19th 2026
 * to run this file directly, use (from the backend directory)
 * `node --loader ts-node/esm src/scrapers/millshardware.ts` 
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
  cost?: number | undefined;
  source_url: string;
  image: string;
  artist?: string;
};

function cleanText(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function parseLowestPrice(lines: string[]): number | null {
  // matches $10, $22, $15.00, etc.
  const prices: number[] = [];
  for (const line of lines) {
    const matches = line.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/g);
    if (!matches) continue;
    for (const m of matches) {
      const n = Number(m.replace("$", ""));
      if (!Number.isNaN(n)) prices.push(n);
    }
  }
  return prices.length ? Math.min(...prices) : null;
}

function parseDateTimeToronto(dateLine: string): Date | null {
  // Example:
  // "SAT JAN 24, 2026 • 8PM DOOR, 9PM SHOW"
  // "FRI FEB 13 2026 • 7PM DOOR, 8PM SHOW" (sometimes no comma)
  const m = dateLine.match(
    /([A-Z]{3})\s+([A-Z]{3})\s+(\d{1,2})(?:,)?\s+(\d{4})\s*•\s*([0-9]{1,2})(?::([0-9]{2}))?\s*(AM|PM)\s*DOOR,\s*([0-9]{1,2})(?::([0-9]{2}))?\s*(AM|PM)\s*SHOW/i
  );
  if (!m) return null;

  const monthMap: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };

  const mon = monthMap[m[2]!.toUpperCase()];
  const day = Number(m[3]);
  const year = Number(m[4]);

  // Prefer SHOW time (it’s what people usually mean by start_time)
  let hh = Number(m[8]);
  let mm = m[9] ? Number(m[9]) : 0;
  const ampm = m[10]!.toUpperCase();

  if (ampm === "AM" && hh === 12) hh = 0;
  if (ampm === "PM" && hh !== 12) hh += 12;

  // NOTE: this creates a Date in *local runtime timezone*.
  const local = new Date(year, mon!, day, hh, mm, 0, 0);
  return local;
}


// replace with Tixr API / scraper later?
export async function scrapeWebsite(url: string) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const cheerioObj = cheerio.load(html);
    const results: Event[] = [];

    const ctas = cheerioObj("a").filter((_, a) => {
        const t = cleanText(cheerioObj(a).text()).toUpperCase();
        return t === "GET TICKETS" || t === "SOLD OUT";
    }).toArray();

    // collect lines by walking backwards from each CTA
    // stop when hit the title <p class="sqsrte-large">
    for (const a of ctas) {
        const $a = cheerioObj(a);
        const block: string[] = [];
        let node = $a.parent().prev();
        let safety = 0;
        while (node.length && safety < 40) {
            safety++;
            if (node.is("p")) {
                const text = cleanText((node.text()));
                if (text) {
                    const isTitle = node.hasClass("sqsrte-large");
                    block.push(text);
                    if (isTitle) break;
                }
            }
            node = node.prev();
        }
        block.reverse();
        if (!block.length) continue;
        // block[0] should be title


        // heuristics:
        // first line, given by <p class="sqsrte-large"> is the title (block[0])
        // date line contains " •  and a year"
        // price line contains "$"
        // source_url is from the CTA link href
        // artist is also title + line starting with "with " if present
        // description is each line separated by newline except title, date, price

        // get title, separate from non-title lines
        const title = block[0] ?? "Untitled Event";
        const lines = block.map(l => l.trim()).filter(l => l);

        // find source_url
        const href = $a.attr("href") ?? url;
        const source_url = href.startsWith("http") ? href : new URL(href, url).toString();

        // identify date line
        const dateLine = lines.find(l => l.includes("•") && /\d{4}/.test(l)) ?? "";
        const start_time = parseDateTimeToronto(dateLine);
        if (!start_time) continue; // skip if no date found

        // cost - pick lowest price found (or null)
        const lowest = parseLowestPrice(lines);
        const cost = lowest == null ? undefined : lowest;

        // "with ..." line
        const withLines = lines.filter(l => l.toLowerCase().startsWith("with "));

        // description
        const isBoilerplate = (s: string) => {
            const u = s.toUpperCase();
            return (
                u === "GET TICKETS" ||
                u === "SOLD OUT"
            );
        };
        const descriptionLines = lines.filter(l => 
            !isBoilerplate(l) && !withLines.includes(l)
        );
        const description = descriptionLines.join("\n");

        // artist - title + "with ..." if present
        const artist = withLines.length ? `${title} ${withLines.join(" ")}` : title;

        // image - use a default image for now
        const image = "/images/events/millshardware.jpg";
        
        results.push({ title: title, description: description, start_time: start_time, source_url: source_url, artist: artist, image: image, cost: cost });
    }

    return results;

  } catch (err) {
    console.error("Scraping failed:", err);
    return [];
  }
}

const data = await scrapeWebsite("https://www.millshardware.ca/");
console.log(data);
const venueID = "f35b17ff-ab6a-4e42-9a6c-2688e341e945";

export async function insertScrapedEvents(events: Event[]) {
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

// eventService.deleteEventsForVenue("f35b17ff-ab6a-4e42-9a6c-2688e341e945")
// eventService.deleteEventsForVenue("204cc1c3-e141-4ba1-9e3f-bde3763149d2")