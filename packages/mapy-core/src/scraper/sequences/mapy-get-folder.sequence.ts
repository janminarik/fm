import { Action } from "../core/actions";

export class MapyFolderSequence {
  get(url: string): Action[] {
    return [
      //GotoParams
      {
        type: "goto",
        name: "goToPage",
        params: { url, waitUntil: "networkidle2" },
      },
      {
        type: "waitForSelector",
        name: "waitForSideBarContent",
        params: { selector: "ul.items.sortable", timeout: 5000 },
      },
      {
        type: "getContent",
        name: "getFolderContent",
        params: {},
      },
    ];
  }
}
