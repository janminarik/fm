import { Injectable, Logger } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";

import { IJwtOptions, IJwtVerifyOptions } from "../interfaces";

@Injectable()
export class JwtWrapperService {
  private logger = new Logger(JwtWrapperService.name);

  constructor(private readonly jwtService: NestJwtService) {}

  async jwtEncrypt(
    payload: Record<string, unknown>,
    options: IJwtOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
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

  async jwtVerify(token: string, options: IJwtVerifyOptions): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
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
