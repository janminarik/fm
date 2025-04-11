import { Injectable } from "@nestjs/common";
import { Request } from "express";

import { AuthCookieService } from "./auth-cookie.servise";
import { AuthHeaderService } from "./auth-header.service";

@Injectable()
export class AuthTokenExtractorService {
  constructor(
    private readonly authCookieService: AuthCookieService,
    private readonly authHeaderService: AuthHeaderService,
  ) {}

  extractAccessToken(req: Request): string | null {
    let token = this.authHeaderService.getToken(req);
    if (!token) token = this.authCookieService.getAccessToken(req);
    return token ?? null;
  }

  extractRefreshToken(req: Request): string | null {
    let token = this.authHeaderService.getToken(req);
    if (!token) token = this.authCookieService.getRefreshToken(req);
    return token ?? null;
  }
}
