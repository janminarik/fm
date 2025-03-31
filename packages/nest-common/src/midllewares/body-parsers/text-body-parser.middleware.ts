import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response, text } from "express";

//! Content-Type: text/plain
@Injectable()
export class TextBodyParserMiddleware implements NestMiddleware {
  private readonly maxSize: string;

  constructor(private readonly configService: ConfigService) {
    this.maxSize =
      this.configService.get<string>("app.bodyUrlTextMaxSize") || "1mb";
  }

  use(req: Request, res: Response, next: NextFunction) {
    const middleware = text({
      limit: this.maxSize,
    });

    middleware(req, res, next);
  }
}
