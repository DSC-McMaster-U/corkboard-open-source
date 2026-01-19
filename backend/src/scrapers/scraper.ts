/* Jan 19th 2026
 * to run this file directly, use (from the backend directory)
 * `node --loader ts-node/esm src/scrapers/scraper.ts` 
 */

import { eventService } from "../services/eventService.js";
import { artistService } from "../services/artistService.js";
import { scrapeMillsHardware } from "./millshardware.js";
import { scrapeCorktownPub } from "./corktownpub.js";
import { scrapeBridgeworks } from "./bridgeworks.js";

type Event = {
  title: string;
  description: string;
  start_time: Date;
  cost?: number | undefined;
  source_url: string;
  image: string;
  artist?: string;
};

export async function insertScrapedEvents(events: Event[], venueID: string) {
  function normalizeTitle(s: string) {
    return s.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function pad2(n: number) {
    return String(n).padStart(2, "0");
  }

  function dateOnlyKey(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

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



// main
// map of venue ID to scraper function
const scrapeMap = new Map<string, () => Promise<Event[]>>([
    ["f35b17ff-ab6a-4e42-9a6c-2688e341e945", scrapeMillsHardware],
    ["204cc1c3-e141-4ba1-9e3f-bde3763149d2", scrapeCorktownPub],
    ["22411a86-1b39-442c-8af8-991197838b20", scrapeBridgeworks],
]);

for (const [venueID, scraperFunc] of scrapeMap.entries()) {
    console.log(`Scraping venue ${venueID}...`);
    const data = await scraperFunc();

    if (data?.length) {
      try {
        await insertScrapedEvents(data, venueID);
      } catch (err) {
        console.error("Failed to insert events:", err);
      }
    }
}

console.log(`Finished scraping ${scrapeMap.size} venues.`);