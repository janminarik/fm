import { Action } from "../core/actions";

export class FolderSequence {
  static get(url: string): Action[] {
    return [
      //GotoParams
      {
        type: "goto",
        name: "go-to-page",
        params: { url, waitUntil: "networkidle2" },
      },
      {
        type: "waitForSelector",
        name: "wait-for-sidebar-loaded",
        params: { selector: "ul.items.sortable", timeout: 5000 },
      },
      {
        type: "getContent",
        name: "get-page-content",
        params: {},
      },
    ];
  }
}
