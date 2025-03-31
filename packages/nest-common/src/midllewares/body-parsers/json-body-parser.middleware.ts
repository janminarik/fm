import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response, json } from "express";
// Import json z express namiesto body-parser

//TODO: clean up

//! potrebne vypnut default Nest body-parser (options : {bodyParser: false})
//! rozslisuje sa podla header Content-Type v request
//! NestJs body parser default hodnoty

/*
JSON: limit je nastavený na 100kb.
Text: limit je tiež 100kb.
Raw: limit je 100kb.
URL-encoded: limit je 100kb a parameter extended je nastavený na hodnotu true.
*/

//! Content-Type: application/json
@Injectable()
export class JsonBodyParserMiddleware implements NestMiddleware {
  private readonly maxSize: string;

  constructor(private readonly configService: ConfigService) {
    this.maxSize =
      this.configService.get<string>("app.bodyJsonMaxSize") || "100kb";
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.readable) {
      const middleware = json({
        limit: this.maxSize,
      });

      middleware(req, res, next);
    } else {
      next();
    }
  }
}
