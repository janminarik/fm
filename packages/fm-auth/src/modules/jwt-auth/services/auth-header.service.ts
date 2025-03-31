import { Injectable } from "@nestjs/common";
import { Request } from "express";

import { AuthHeader, AuthSchema } from "../config";

@Injectable()
export class AuthHeaderService {
  private authHeader: AuthHeader;
  private authSchema: AuthSchema;

  constructor() {
    this.authHeader = AuthHeader.AUTHORIZATION;
    this.authSchema = AuthSchema.BEARER;
  }

  getToken(req: Request) {
    const headerName = this.getHeaderName(this.authHeader, req);

    if (!headerName) return null;

    const auth = req.headers[headerName];

    if (auth) {
      return this.getHeaderValue(auth, this.authSchema);
    } else {
      return undefined;
    }
  }

  private getHeaderName(authHeader: string, req: Request) {
    return Object.keys(req.headers).find(
      (key) => key.toLowerCase() === authHeader.toLowerCase(),
    );
  }

  private getHeaderValue(
    authorization: string | string[],
    scheme: string,
  ): string | null {
    if (!authorization) return null;

    const header = Array.isArray(authorization)
      ? authorization[0]
      : authorization;

    const regex = new RegExp(`^${scheme} (.+)$`, "i");
    const match = header ? header.match(regex) : null;
    return match && match[1] !== undefined ? match[1] : null;
  }
}
