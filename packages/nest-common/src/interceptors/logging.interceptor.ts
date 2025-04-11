import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { Observable, tap } from "rxjs";

import { REQUEST_USER_AGENT_HEADER } from "../constants";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger("NestCommon.LoggingInterceptor");

  intercept<T>(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<T> | Promise<Observable<T>> {
    const startTime = performance.now();

    const request = context.switchToHttp().getRequest<Request>();
    const { ip, method, url } = request;
    const userAgent = request.get(REQUEST_USER_AGENT_HEADER) || null;

    this.logger.log(
      `Request ${method} | ${url} | ${ip} | Controller ${context.getClass().name} | Route: ${context.getHandler().name}`,
    );

    return next.handle().pipe(
      tap((_res) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;

        const elapsedTime = performance.now() - startTime;

        this.logger.log(
          `Response ${method} | ${url} | ${statusCode} | Duration: ${elapsedTime} ms | ${userAgent} | ${ip}`,
        );
      }),
    );
  }
}
