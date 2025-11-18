/* November 16th, 2025
 * This scarper utility is not complete, and is meant to be more proof of concept to be expanded later
 * As of now, it only support scrapigng text from the corktwon pub's list of events.
 * 
 * to run this file directly, use `node --loader ts-node/esm src/utils/scraper.ts` (from the backend directory)
 */

import axios from "axios";
import * as cheerio from "cheerio";

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
    const results: { date: string; stage: string, band: string }[] = [];

    cheerioObj("h4").each((_, el) => {
        // h4 element is the time, and then go up a div, go to the next and the strong is the stage and time
      const outerDiv = cheerioObj(el).parent().parent();
      const date = cheerioObj(el).text().trim();
      const stage = outerDiv.next("div").find("strong").first().text().trim();

      // it is important to use the character U+2013 "–" in the regex, and not the regular hyphen "-"
      var tempBand = outerDiv.next("div").first().text().trim();
      var regex = new RegExp(`^${stage} – `);
      const band = tempBand.replace(regex, "").trim()

      results.push({ date, stage, band });
    });

    return results;

  } catch (err) {
    console.error("Scraping failed:", err);
    return [];
  }
}

const data = await scrapeWebsite("https://corktownpub.ca/on-the-stage/");
console.log(data);
