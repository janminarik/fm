import { Injectable } from "@nestjs/common";

import { Folder, RouteDetail } from "../entities";
import { type ILogger } from "../logger";
import { ActionResult, ActionSequenceExecutor } from "./action-sequence";
import {
  FolderSequence,
  RouteDetailSequence,
} from "./action-sequence/sequences";
import { FolderParser } from "./html-parsers/folder-parser";
import { FolderRoutesParser } from "./html-parsers/folder-routes-parser";
import { RouteDetailParser } from "./html-parsers/route-detail-parser";

//TODO: Parser factory
@Injectable()
export class MapsScraperService {
  constructor(
    private readonly executor: ActionSequenceExecutor,
    private readonly logger: ILogger,
  ) {}

  async getFolder(
    sharedFolderUrl: string,
    routeDetails?: boolean,
    routeDetailBaseUrl?: string,
  ): Promise<Folder> {
    this.logger.info("Start processing folder", { url: sharedFolderUrl });

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
        throw new Error("The routeDetailBaseUrl argument must be provided.");

      for (const route of folder.routes) {
        route.detail = await this.getRouteDetail(
          routeDetailBaseUrl,
          route.dataId,
        );
      }
    }

    this.logger.info("Finish processing folder");

    return folder;
  }

  public async getRouteDetail(
    routeDetailBaseUrl: string,
    routeDataId: string,
  ): Promise<RouteDetail> {
    const url = `${routeDetailBaseUrl}&dim=${routeDataId}`;

    this.logger.info("Start processing route detail", {
      url,
    });

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

    this.logger.info("Finish processing route detail");

    return routeDetail;
  }
}
