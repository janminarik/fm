import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { IRequest } from "../interfaces";
import { generateId } from "../utils";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const customReq = req as IRequest;
    if (!customReq?.id) {
      customReq.id = generateId();
    }
    next();
  }
}
