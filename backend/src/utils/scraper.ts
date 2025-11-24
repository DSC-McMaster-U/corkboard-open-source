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
    const results: { start_time: Date; description: string, title: string }[] = [];

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

      if (minStr.includes("pm")) {
        if (minStr.includes("12"))
          hourStr = "0";
        else {
          let hourTemp = Number(hourStr) + 12;
          hourStr = String(hourTemp);
        }
      }

      minStr = minStr.replace(/(am|pm)/, "");


      // it is important to use the character U+2013 "–" in the regex, and not the regular hyphen "-"
      var tempTitle = outerDiv.next("div").first().text().trim();
      var regex = new RegExp(`^${rawTimeAndStage} – `);
      const title = tempTitle.replace(regex, "").trim()

      // construct start_time from date 
      let parts = rawDate.split(" ");
      let dd = parts[2]?.replace(/\D+/g, "") ?? 0;
      if (!dd) return;
      let yyyy = new Date().getFullYear();

      const monthDict = {
        'JANUARY': 0, 'FEBRUARY': 1, 'MARCH': 2,
        'APRIL': 3, 'MAY': 4, 'JUNE': 5,
        'JULY': 6, 'AUGUST': 7, 'SEPTEMBER': 8,
        'OCTOBER': 9, 'NOVEMBER': 10, 'DECEMBER': 11
      };
      const month = parts[1]?.toUpperCase() as keyof typeof monthDict;
      let mm = monthDict[month];
      if (mm === undefined) return;

      const start_time = new Date(Date.UTC(yyyy, mm, Number(dd), Number(hourStr), Number(minStr), 0));

      results.push({ start_time, description, title });
    });

    return results;

  } catch (err) {
    console.error("Scraping failed:", err);
    return [];
  }
}

const data = await scrapeWebsite("https://corktownpub.ca/on-the-stage/");
console.log(data);
