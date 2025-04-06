import * as cheerio from "cheerio";

import { HtmlParser } from "./html-parser";
import { Folder } from "../../entities";

export class FolderParser implements HtmlParser<Folder> {
  parse(html: string): Folder {
    const $ = cheerio.load(html);

    const title = $(".ui-heroheader__title").text().trim() || "";

    return new Folder(title);
  }
}
