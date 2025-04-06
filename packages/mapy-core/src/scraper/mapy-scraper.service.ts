import * as fs from "fs/promises";

import { Injectable } from "@nestjs/common";

import {
  ActionResult,
  ActionSequenceExecutor,
} from "../scraper/action-sequence";
import { MapyParserService } from "../services";
import { MapyFolderSequence } from "./action-sequence/sequences";

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

    await fs.writeFile("test.html", html);

    const mapyService = new MapyParserService();
    const folder = mapyService.parseFolder(html);

    //action =
    // {type: 'getContent', name: 'getFolderContent', params: {…}}
    return folder;
  }
}
