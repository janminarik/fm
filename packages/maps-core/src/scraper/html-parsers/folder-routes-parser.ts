import * as cheerio from "cheerio";

import { HtmlParser } from "./html-parser";
import { Route } from "../../entities";

export class FolderRoutesParser implements HtmlParser<Route[]> {
  parse(html: string): Route[] {
    const routes: Route[] = [];

    const $ = cheerio.load(html);

    const items = $("ul.items.sortable li");

    items.each((index, element) => {
      const title = $(element).attr("title") || "";
      const dataId = $(element).attr("data-id") || "";

      const lines = title.split("\n").map((line) => line.trim());
      const name = lines[0] || "";

      const route = new Route(dataId, name);
      routes.push(route);
    });

    return routes;
  }

  //TODO: move to detail

  // private parseRoute(dataId: string, title: string): Route {
  //   // Rozdelenie title atribútu podľa nového riadka
  //   const lines = title.split("\n").map((line) => line.trim());
  //   const name = lines[0] || "";

  //   // Ak má položka len jeden riadok alebo druhý riadok neobsahuje "Route", je to marker alebo mesto | dedina etc
  //   if (lines.length < 2 || !(lines[1] || "").includes("Route")) {
  //     // Vratíme len názov bez vzdialenosti a trvania
  //     return new Route(dataId, name);
  //   }

  //   // Parsovanie informácií o trase z druhého riadku
  //   const routeInfo = lines[1] || "";

  //   // Extrakcia vzdialenosti (km)
  //   const distanceMatch = routeInfo.match(/(\d+(?:\.\d+)?)\s*km/);
  //   const distance =
  //     distanceMatch && distanceMatch[1]
  //       ? parseFloat(distanceMatch[1])
  //       : undefined;

  //   // Extrakcia času (hodiny)
  //   const durationMatch1 = routeInfo.match(/(\d+):(\d+)\s*h/);
  //   const durationMatch2 = routeInfo.match(/(\d+)(?:\.\d+)?\s*h/);
  //   const durationMatch = durationMatch1 || durationMatch2;

  //   let duration: number | undefined = undefined;

  //   if (durationMatch) {
  //     if (durationMatch[2]) {
  //       // Formát HH:MM
  //       const hours = parseInt(durationMatch[1] || "0", 10);
  //       const minutes = parseInt(durationMatch[2] || "0", 10);
  //       duration = hours + minutes / 60;
  //     } else if (durationMatch[1]) {
  //       // Formát HH.MM alebo len HH
  //       duration = parseFloat(durationMatch[1]);
  //     }
  //   }

  //   const route = new Route(dataId, name);

  //   route.distance = distance;
  //   route.duration = duration;
  //   route.displayDuration = duration
  //     ? this.formatDuration(duration)
  //     : undefined;

  //   return route;
  // }

  // private formatDuration(hours?: number): string {
  //   if (hours === undefined) return "N/A";

  //   const wholeHours = Math.floor(hours);
  //   const minutes = Math.round((hours - wholeHours) * 60);

  //   return `${wholeHours}:${minutes.toString().padStart(2, "0")} h`;
  // }
}
