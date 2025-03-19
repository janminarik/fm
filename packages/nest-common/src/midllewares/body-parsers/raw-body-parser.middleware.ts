import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";

//! Content-Type: application/octet-stream
@Injectable()
export class RawBodyParserMiddleware implements NestMiddleware {
  private readonly maxSize: string;

  constructor(private readonly configService: ConfigService) {
    this.maxSize = this.configService.get("app.bodyUrlRawMaxSize");
  }

  use(req: Request, res: Response, next: NextFunction) {
    bodyParser.raw({
      limit: this.maxSize,
    })(req, res, next);
  }
}
