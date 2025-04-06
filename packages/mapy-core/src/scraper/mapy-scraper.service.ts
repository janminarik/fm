import { Injectable } from "@nestjs/common";

import {
  ActionResult,
  ActionSequenceExecutor,
} from "../scraper/action-sequence";
// import { MapyParserService } from "../services";
import { MapyFolderSequence } from "./action-sequence/sequences";
import { FolderParser } from "./html-parsers/folder-parser";
import { FolderRoutesParser } from "./html-parsers/folder-routes-parser";

@Injectable()
export class MapyScraperService {
  constructor(private readonly executor: ActionSequenceExecutor) {}

  async getFolder(url: string): Promise<any> {
    const sequence = MapyFolderSequence.get(url);

    const actionResults: ActionResult[] = await this.executor.executeSequence(
      sequence,
      {
        stopOnError: true,
      },
    );

    const geContentResult = actionResults.findLast(
      (r) => r.action?.type === "getContent" && r.data,
    );

    const html = geContentResult?.data as string;

    const folderParser = new FolderParser();
    const folder = folderParser.parse(html);

    const folderRouteParser = new FolderRoutesParser();
    const routes = folderRouteParser.parse(html);

    folder.addRoutes(routes);

    // await fs.writeFile("test.html", html);

    // const mapyService = new MapyParserService();
    // const folder = mapyService.parseFolder(html);

    //action =
    // {type: 'getContent', name: 'getFolderContent', params: {…}}
    return folder;
  }
}
