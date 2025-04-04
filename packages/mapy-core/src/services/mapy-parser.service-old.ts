// mapy-parser.service.ts
import { HttpService } from "@nestjs/axios";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";

import { Folder, Route } from "../entities";

@Injectable()
export class MapyParserServiceOld {
  constructor(private httpService: HttpService) {}

  async parseFolder(url: string): Promise<Folder> {
    try {
      // Kontrola, či URL obsahuje validný mapový folder
      // if (!url.includes('mapy.com/s/')) {
      //   throw new HttpException('Neplatné URL mapy.com folderu', HttpStatus.BAD_REQUEST);
      // }

      // Počkajte na načítanie zoznamu trás
      // await page.waitForSelector("#mymaps", {
      //   timeout: 10000,
      // });

      // await page.waitForFunction(
      //   () => {
      //     const items = document.querySelectorAll(".title .overflow-ellipsis");

      //     console.log("---------------- item count", items?.length);

      //     return items.length > 0;
      //   },
      //   { timeout: 20000 },
      // );

      // await page.waitForSelector("ui-sortbox__buttontext", { timeout: 10000 });

      // Použitie Puppeteer pre načítanie dynamického obsahu stránky
      const html = await this.fetchHtmlWithPuppeteer(url);
      return this.parseFolderFromHtml(html);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Neznáma chyba";
      throw new HttpException(
        "Chyba pri načítaní folderu: " + errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Načíta HTML stránky pomocou Puppeteer, ktorý vykoná JavaScript
   */
  private async fetchHtmlWithPuppeteer(url: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true, // Použitie nového 'headless' módu
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Pre kompatibilitu v CI prostredí
    });

    try {
      const page = await browser.newPage();

      // Nastavenie väčšieho timeout pre načítanie stránky (30 sekúnd)
      await page.setDefaultNavigationTimeout(30000);

      // Načítanie URL
      await page.goto(url, { waitUntil: "networkidle0" });

      // Počkať na načítanie obsahu folderu
      await page.waitForSelector(".items.sortable .item.public", {
        timeout: 10000,
      });

      // Získanie HTML obsahu stránky
      const content = await page.content();

      return content;
    } finally {
      // Vždy zatvoriť prehliadač, aj keď dôjde k chybe
      await browser.close();
    }
  }

  private parseFolderFromHtml(html: string): Folder {
    // Použitie cheerio pre parsovanie HTML (podobné jQuery)
    const $ = cheerio.load(html);

    // Získanie názvu folderu
    const folderTitle = $(".ui-heroheader__title").text().trim() || "";

    const folder = new Folder(folderTitle);

    // Hľadanie všetkých položiek trás
    $(".items.sortable .item.public").each((i, element) => {
      const titleAttr = $(element).attr("title") || "";
      const route = this.parseRouteFromTitle(titleAttr);
      folder.addRoute(route);
    });

    return folder;
  }

  private parseRouteFromTitle(title: string): Route {
    // Rozdelenie title atribútu podľa nového riadka
    const lines = title.split("\n").map((line) => line.trim());
    const name = lines[0] || "";

    // Ak má položka len jeden riadok alebo druhý riadok neobsahuje "Route", je to marker alebo dedina
    if (lines.length < 2 || !(lines[1] || "").includes("Route")) {
      // Vratíme len názov bez vzdialenosti a trvania
      return new Route(name);
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

    return new Route(name, distance, duration);
  }

  // Pomocná metóda pre formátovanie času (hodiny:minúty)
  formatDuration(hours?: number): string {
    if (hours === undefined) return "N/A";

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    return `${wholeHours}:${minutes.toString().padStart(2, "0")} h`;
  }
}
