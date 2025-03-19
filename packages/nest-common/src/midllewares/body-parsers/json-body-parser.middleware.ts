import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";

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
    this.maxSize = this.configService.get("app.bodyJsonMaxSize");
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.readable) {
      bodyParser.json({
        limit: this.maxSize,
      })(req, res, next);
    } else {
      next();
    }
  }
}
