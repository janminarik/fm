import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { IRequestContext } from "../interfaces";

export class RequestContextInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<
      Request & {
        user: any;
        params: Record<string, any>;
        query: Record<string, any>;
        cookies: Record<string, any>;
        customContext: IRequestContext;
      }
    >();

    const customContext: IRequestContext = {
      headers: request?.headers,
      user: request.user,
      params: {
        params: request.params,
        query: request.query,
        body: request.body as Record<string, any>,
      },
    };

    request.customContext = customContext;

    return next.handle();
  }
}
