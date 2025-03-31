import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response, urlencoded } from "express";

//! application/x-www-form-urlencoded
@Injectable()
export class UrlencodedBodyParserMiddleware implements NestMiddleware {
  private readonly maxSize: string;
  constructor(private readonly configService: ConfigService) {
    this.maxSize =
      this.configService.get("app.bodyUrlEncodedMaxSize") || "10mb";
  }

  use(req: Request, res: Response, next: NextFunction) {
    const middleware = urlencoded({
      extended: true,
      limit: this.maxSize,
    });

    middleware(req, res, next);
  }
}
