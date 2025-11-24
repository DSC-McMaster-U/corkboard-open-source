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
      const rawDate = cheerioObj(el).text().trim();
      const stage = outerDiv.next("div").find("strong").first().text().trim();

      // it is important to use the character U+2013 "–" in the regex, and not the regular hyphen "-"
      var tempBand = outerDiv.next("div").first().text().trim();
      var regex = new RegExp(`^${stage} – `);
      const band = tempBand.replace(regex, "").trim()

      // construct start_time from date 
      let parts = rawDate.split(" ");
      let dd = parts[2]?.replace(/\D+/g, "");;
      if (!dd) return; 
      dd = dd.padStart(2, "0");
      let yyyy = new Date().getFullYear();

      const monthDict = {
        'JANUARY': '01', 'FEBRUARY': '02', 'MARCH': '03',
        'APRIL': '04', 'MAY': '05', 'JUNE': '06',
        'JULY': '07', 'AUGUST': '08', 'SEPTEMBER': '09',
        'OCTOBER': '10', 'NOVEMBER': '11', 'DECEMBER': '12'
      };
      const month = parts[1]?.toUpperCase() as keyof typeof monthDict;
      let mm = monthDict[month];
      if (!mm) return; 

      const date = yyyy + "-" + mm + "-" + dd;


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
