import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { AuthCookieService } from "@repo/fm-auth";
import { Response } from "express";
import { map, Observable } from "rxjs";

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  constructor(private authCookieService: AuthCookieService) {}

  intercept<T>(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const response = context.switchToHttp().getResponse<Response>();

        this.authCookieService.clearCookie(response);
        return data;
      }),
    );
  }
}
