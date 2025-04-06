import { Injectable } from "@nestjs/common";
import { RouteDetail } from "src/entities";

import {
  ActionResult,
  ActionSequenceExecutor,
} from "../scraper/action-sequence";
import {
  FolderSequence,
  RouteDetailSequence,
} from "./action-sequence/sequences";
import { FolderParser } from "./html-parsers/folder-parser";
import { FolderRoutesParser } from "./html-parsers/folder-routes-parser";
import { RouteDetailParser } from "./html-parsers/route-detail-parser";

Parser factory
@Injectable()
export class MapyScraperService {
  constructor(private readonly executor: ActionSequenceExecutor) {}

  async getFolder(
    sharedFolderUrl: string,
    routeDetails?: boolean,
    routeDetailBaseUrl?: string,
  ): Promise<any> {
    const folderSeq = FolderSequence.get(sharedFolderUrl);

    const folderSeqResult: ActionResult[] = await this.executor.executeSequence(
      folderSeq,
      {
        stopOnError: true,
      },
    );

    const folderContentResult = folderSeqResult.findLast(
      (r) => r.action?.type === "getContent" && r.data,
    );

    const html = folderContentResult?.data as string;

    const folderParser = new FolderParser();
    const folder = folderParser.parse(html);

    const folderRouteParser = new FolderRoutesParser();
    const routes = folderRouteParser.parse(html);

    folder.addRoutes(routes);

    if (routeDetails) {
      if (!routeDetailBaseUrl)
        throw new Error("Argument routeDetailBaseUrl can not be empty");

      for (const route of folder.routes) {
        route.detail = await this.getRouteDetail(
          routeDetailBaseUrl,
          route.dataId,
        );
      }
    }

    return folder;
  }

  public async getRouteDetail(
    routeDetailBaseUrl: string,
    routeDataId: string,
  ): Promise<RouteDetail> {
    const url = `${routeDetailBaseUrl}&dim=${routeDataId}`;

    const routeSeq = RouteDetailSequence.get(url);

    const routeSeqResult: ActionResult[] = await this.executor.executeSequence(
      routeSeq,
      {
        stopOnError: true,
      },
    );

    const routeContentResult = routeSeqResult.findLast(
      (r) => r.action?.type === "getContent" && r.data,
    );

    const html = routeContentResult?.data as string;

    const routeDetailParser = new RouteDetailParser();
    const routeDetail = routeDetailParser.parse(html);

    return routeDetail;
  }
}
