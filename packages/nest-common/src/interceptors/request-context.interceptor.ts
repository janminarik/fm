import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

import { IRequest, IRequestContext } from "../interfaces";

export class RequestContextInterceptor implements NestInterceptor {
  intercept<T>(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    const request = context.switchToHttp().getRequest<IRequest>();

    const customContext: IRequestContext = {
      headers: request.headers,
      user: request.user,
      params: {
        params: request.params,
        query: request.query as Record<string, string | string[] | undefined>,
        body: request.body as Record<string, unknown>,
        cookies: request.cookies,
      },
    };

    request.context = customContext;

    return next.handle();
  }
}
