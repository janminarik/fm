import * as fs from "fs/promises";

import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { Folder, Route } from "../entities";

puppeteer.use(StealthPlugin());

@Injectable()
export class MapyParserService {
  async parse(url: string): Promise<any> {
    const html = await this.fetchHtml(url);
    // await fs.writeFile("file-b-2.html", html);
    const result = this.parseFolderFromHtml(html);
    return result;
  }

  private async fetchHtml(url: string): Promise<string> {
    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();

      //await page.goto(url);
      await page.goto(url, { waitUntil: "networkidle2" });

      // Čakanie na kontajner zoznamu trás
      await page.waitForSelector("ul.items.sortable", {
        timeout: 5000, // Zvýšený timeout na 15 sekúnd
      });
      //console.log("Kontajner 'ul.items.sortable' nájdený.");

      // Čakanie na načítanie aspoň jednej položky v zozname
      // await page.waitForFunction(
      //   () =>
      //     document.querySelectorAll("ul.items.sortable li.item.public").length >
      //     0,
      //   { timeout: 5000 },
      // );
      // console.log("Načítané položky v zozname trás.");

      // Dodatočné oneskorenie pre úplné dorenderovanie
      // await page.waitForTimeout(2000);

      // Pridanie krátkeho oneskorenia pre istotu, ak sa obsah ešte dorenderuje
      // await page.waitForTimeout(2000);

      const content = await page.content();
      await fs.writeFile("file.html", content);

      const $ = cheerio.load(content);

      const items = $("li");

      //console.log(items.length);

      //await fs.writeFile("file.html", content);

      await page.screenshot({ path: "screenshot.png" });

      return content;
    } finally {
      //await browser.close();
    }
  }

  private parseFolderFromHtml(html: string): Folder {
    const $ = cheerio.load(html);

    const folderTitle = $(".ui-heroheader__title").text().trim() || "";
    const folder = new Folder(folderTitle);

    const items = $("ul.items.sortable li");

    items.each((index, element) => {
      const title = $(element).attr("title") || "";
      const dataId = $(element).attr("data-id") || "";
      // // console.log(`Item ${index}: ID = ${id}, Title = ${title}`);

      // const route = new Route(id, name, 0, 0);

      const route = this.parseRoute(dataId, title);

      folder.addRoute(route);
    });

    return folder;
  }

  private parseRoute(dataId: string, title: string): Route {
    // Rozdelenie title atribútu podľa nového riadka
    const lines = title.split("\n").map((line) => line.trim());
    const name = lines[0] || "";

    // Ak má položka len jeden riadok alebo druhý riadok neobsahuje "Route", je to marker alebo dedina
    if (lines.length < 2 || !(lines[1] || "").includes("Route")) {
      // Vratíme len názov bez vzdialenosti a trvania
      return new Route(dataId, name);
    }

    // Parsovanie informácií o trase z druhého riadku
    const routeInfo = lines[1] || "";

    // Extrakcia vzdialenosti (km)
    const distanceMatch = routeInfo.match(/(\d+(?:\.\d+)?)\s*km/);
    const distance =
      distanceMatch && distanceMatch[1]
        ? parseFloat(distanceMatch[1])
        : undefined;

    // Extrakcia času (hodiny)
    const durationMatch1 = routeInfo.match(/(\d+):(\d+)\s*h/);
    const durationMatch2 = routeInfo.match(/(\d+)(?:\.\d+)?\s*h/);
    const durationMatch = durationMatch1 || durationMatch2;

    let duration: number | undefined = undefined;

    if (durationMatch) {
      if (durationMatch[2]) {
        // Formát HH:MM
        const hours = parseInt(durationMatch[1] || "0", 10);
        const minutes = parseInt(durationMatch[2] || "0", 10);
        duration = hours + minutes / 60;
      } else if (durationMatch[1]) {
        // Formát HH.MM alebo len HH
        duration = parseFloat(durationMatch[1]);
      }
    }

    const formattedDuration = duration
      ? this.formatDuration(duration)
      : duration;

    return new Route(dataId, name, distance, duration, formattedDuration);
  }

  // Pomocná metóda pre formátovanie času (hodiny:minúty)
  formatDuration(hours?: number): string {
    if (hours === undefined) return "N/A";

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    return `${wholeHours}:${minutes.toString().padStart(2, "0")} h`;
  }
}
