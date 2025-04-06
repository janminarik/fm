import { Action } from "../core";

export class RouteDetailSequence {
  static get(url: string): Action[] {
    return [
      {
        type: "setViewport",
        name: "set-viewport",
        params: { width: 3840, height: 2160 },
      },
      {
        type: "goto",
        name: "go-to-page",
        params: { url, waitUntil: "networkidle2" },
      },
      {
        type: "waitForSelector",
        name: "wait-for-route-detail-content-loaded",
        params: { selector: "div.language-control2", timeout: 5000 },
      },
      {
        type: "clickIfExists",
        name: "click-on-elevation-if-exists",
        params: { selector: "div.route-height-profile-form-header" },
      },
      {
        type: "screenshot",
        name: "take-screenshot-of-route-detail",
        params: { type: "png", path: "route-detail.png", fullPage: true },
      },
      {
        type: "getContent",
        name: "get-page-content",
        params: {},
      },
    ];
  }
}
