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

  intercept<T>(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const response = context.switchToHttp().getResponse<Response>();

        const auth = data as AuthTokenPairDto;

        const {
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
        } = auth;

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
