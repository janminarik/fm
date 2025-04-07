import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { AuthCookieService } from "@repo/fm-auth";
import { Response } from "express";
import { Observable, map } from "rxjs";

import { AuthTokenPairDto } from "../dto/auth-token-pair.dto";

@Injectable()
export class LoginInterceptor implements NestInterceptor {
  constructor(private readonly authCookieService: AuthCookieService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: AuthTokenPairDto) => {
        const response = context.switchToHttp().getResponse<Response>();

        const {
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
        } = data;

        this.authCookieService.setCookie(response, {
          accessToken: {
            token: accessToken,
            expiresAt: accessTokenExpiresAt,
          },
          refreshToken: {
            token: refreshToken,
            expiresAt: refreshTokenExpiresAt,
          },
        });

        return data;
      }),
    );
  }
}
