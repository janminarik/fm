import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";

//! Content-Type: text/plain
@Injectable()
export class TextBodyParserMiddleware implements NestMiddleware {
  private readonly maxSize: string;

  constructor(private readonly configService: ConfigService) {
    this.maxSize = this.configService.get("app.bodyUrlTextMaxSize");
  }

  use(req: Request, res: Response, next: NextFunction) {
    bodyParser.text({
      limit: this.maxSize,
    })(req, res, next);
  }
}
