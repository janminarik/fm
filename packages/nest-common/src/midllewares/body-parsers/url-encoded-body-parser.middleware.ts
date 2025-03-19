import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";

//! application/x-www-form-urlencoded
@Injectable()
export class UrlencodedBodyParserMiddleware implements NestMiddleware {
  private readonly maxSize: string;
  constructor(private readonly configService: ConfigService) {
    this.maxSize = this.configService.get("app.bodyUrlEncodedMaxSize");
  }

  use(req: Request, res: Response, next: NextFunction) {
    bodyParser.urlencoded({
      extended: true,
      limit: this.maxSize,
    })(req, res, next);
  }
}
