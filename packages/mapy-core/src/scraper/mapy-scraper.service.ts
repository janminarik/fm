import * as fs from "fs/promises";

import { Injectable } from "@nestjs/common";

import { ActionResult } from "./core";
import { ActionSequenceExecutor } from "./core/action-sequence-executor";
import { MapyFolderSequence } from "./sequences";

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

    const html = actionResults.findLast(
      (r) => r.action?.type === "getContent" && r.data,
    );

    await fs.writeFile("test.html", html?.data as string);

    //action =
    // {type: 'getContent', name: 'getFolderContent', params: {…}}
    return actionResults;
  }
}
