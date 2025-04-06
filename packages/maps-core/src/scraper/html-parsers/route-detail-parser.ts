import * as cheerio from "cheerio";

import { HtmlParser } from "./html-parser";
import { RouteDetail, RoutePoint } from "../../entities";

export class RouteDetailParser implements HtmlParser<RouteDetail> {
  parse(html: string): RouteDetail {
    const routeDetail = new RouteDetail();

    const $ = cheerio.load(html);

    const duration = $("h3.alt-0.active span.time").text();
    const distance = $("h3.alt-0.active span.distance").text();
    const elevation = $("div.line-chart p.desc span.value");

    const routePointsEl = $(
      "div.route-items-list div.route-item-point div.cont h4.dad-handle",
    );

    routePointsEl.each((index, routePointEl) => {
      const coordinateString = $(routePointEl).text();
      const routePoint = new RoutePoint(coordinateString);
      routeDetail.points.push(routePoint);
    });

    let ascent = undefined;
    let descent = undefined;

    if (elevation && elevation.length === 2) {
      ascent = elevation[0] ? $(elevation[0]).text() : undefined;
      descent = elevation[1] ? $(elevation[1]).text() : undefined;
    }

    routeDetail.duration = duration;
    routeDetail.distance = distance;
    routeDetail.ascent = ascent;
    routeDetail.descent = descent;

    return routeDetail;
  }
}
