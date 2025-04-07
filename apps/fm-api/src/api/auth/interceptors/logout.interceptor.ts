import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { AuthCookieService } from "@repo/fm-auth";
import { map, Observable } from "rxjs";
import { Response } from "express";

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  constructor(private authCookieService: AuthCookieService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();

        this.authCookieService.clearCookie(response);
        return data;
      }),
    );
  }
}
