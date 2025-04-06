import * as fs from "fs/promises";

import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { Folder, Route } from "../entities";

puppeteer.use(StealthPlugin());

type RouteDetail = {
  distance: string;
  duration: string;
  ascent: string | undefined;
  descent: string | undefined;
};

@Injectable()
export class MapyParserService {
  async parse(url: string): Promise<any> {
    const html = await this.fetchFolderHtml(url);
    const folder = this.parseFolder(html);

    for (const route of folder.routes) {
      const html = await this.fetchRouteDetailHtml(route.dataId);

      await fs.writeFile("detail.html", html);

      const routeDetail = this.parseRouteDetail(html);

      route.detail_distance = routeDetail.distance;
      route.detail_duration = routeDetail.duration;
      route.detail_total_ascent = routeDetail.ascent;
      route.detail_total_descent = routeDetail.descent;

      // console.log(html);
    }

    return folder;
  }

  private async fetchFolderHtml(url: string): Promise<string> {
    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });

      // Čakanie na kontajner zoznamu trás
      await page.waitForSelector("ul.items.sortable", {
        timeout: 5000, // Zvýšený timeout na 15 sekúnd
      });

      const content = await page.content();
      //await page.screenshot({ path: "screenshot.png" });
      return content;
    } finally {
      await browser.close();
    }
  }

  //TODO: FolderParser, RouteParser, RouteDetailParser

  private async fetchRouteDetailHtml(routeDataId: string): Promise<string> {
    const browser = await puppeteer.launch({ headless: true });
    try {
      const url = `https://mapy.com/en/turisticka?planovani-trasy&dim=${routeDataId}`;

      const page = await browser.newPage();

      await page.setViewport({
        width: 3840,
        height: 2160,
      });

      await page.goto(url, { waitUntil: "networkidle2" });

      await page.waitForSelector("div.language-control2", {
        timeout: 5000, // Zvýšený timeout na 15 sekúnd
      });

      // await page.click(".route-height-profile-form-header");

      //await page.waitForSelector(".route-height-profile-form-header");
      //await page.click("div.module-content.route-height-profile.content");

      let content = await page.content();

      const $ = cheerio.load(content);

      //speed onboarding close
      // const closeSpeedOnboaringButton = "button.ui-onboarding__button";

      // if ($("closeSpeedOnboaringButton").length > 0) {
      //   await page.click("closeSpeedOnboaringButton");
      // }

      //click on elevation
      const elevationSelector = "div.route-height-profile-form-header";
      if ($(elevationSelector).length > 0) {
        await page.click(elevationSelector);
      }

      await page.screenshot({ path: "screenshot-detail.png" });

      content = await page.content();
      return content;
    } finally {
      await browser.close();
    }
  }

  public parseFolder(html: string): Folder {
    const $ = cheerio.load(html);

    const folderTitle = $(".ui-heroheader__title").text().trim() || "";
    const folder = new Folder(folderTitle);

    const items = $("ul.items.sortable li");

    items.each((index, element) => {
      const title = $(element).attr("title") || "";
      const dataId = $(element).attr("data-id") || "";

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
      : undefined;

    return new Route(dataId, name, distance, duration, formattedDuration);
  }

  private parseRouteDetail(html: string): RouteDetail {
    const $ = cheerio.load(html);

    const duration = $("h3.alt-0.active span.time").text();
    const distance = $("h3.alt-0.active span.distance").text();
    const elevation = $("div.line-chart p.desc span.value");
    let ascent = undefined;
    let descent = undefined;

    if (elevation && elevation.length === 2) {
      ascent = elevation[0] ? $(elevation[0]).text() : undefined;
      descent = elevation[1] ? $(elevation[1]).text() : undefined;
    }

    return { duration, distance, ascent, descent };
  }

  // Pomocná metóda pre formátovanie času (hodiny:minúty)
  formatDuration(hours?: number): string {
    if (hours === undefined) return "N/A";

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    return `${wholeHours}:${minutes.toString().padStart(2, "0")} h`;
  }
}
