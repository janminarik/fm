import { Injectable, Logger } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";

import { IJwtOptions, IJwtVerifyOptions } from "../interfaces";

@Injectable()
export class JwtWrapperService {
  private logger = new Logger(JwtWrapperService.name);

  constructor(private readonly jwtService: NestJwtService) {}

  jwtEncrypt(payload: Record<string, any>, options: IJwtOptions): string {
    return this.jwtService.sign(payload, {
      secret: options.secretKey,
      subject: options.subject,
      audience: options.audience,
      expiresIn: options.expiresIn,
      issuer: options.issuer,
      notBefore: options.notBefore ?? 0,
    });
  }

  jwtDecrypt<T>(token: string): T {
    return this.jwtService.decode<T>(token);
  }

  jwtVerify(token: string, options: IJwtVerifyOptions): boolean {
    try {
      this.jwtService.verify(token, {
        secret: options.secretKey,
        subject: options.subject,
        audience: options.audience,
        ignoreExpiration: options.ignoreExpiration ?? false,
        issuer: options.issuer,
      });

      return true;
    } catch (error: unknown) {
      this.logger.error(error);
      return false;
    }
  }
}
