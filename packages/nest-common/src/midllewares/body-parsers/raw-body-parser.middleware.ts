import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response, raw } from "express";

//! Content-Type: application/octet-stream
@Injectable()
export class RawBodyParserMiddleware implements NestMiddleware {
  private readonly maxSize: string;

  constructor(private readonly configService: ConfigService) {
    this.maxSize =
      this.configService.get<string>("app.bodyUrlRawMaxSize") || "1mb";
  }

  use(req: Request, res: Response, next: NextFunction) {
    const middleware = raw({
      limit: this.maxSize,
    });

    return middleware(req, res, next);
  }
}
