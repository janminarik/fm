import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { REQUESR_USER_AGENT_HEADER } from "../constants";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = performance.now();

    const request = context.switchToHttp().getRequest();
    const { ip, method, path: url } = request;
    const userAgent = request.get(REQUESR_USER_AGENT_HEADER) || null;

    this.logger.log(
      `Request ${method} | ${url} | ${ip} | Controlller ${context.getClass().name} | Route: ${context.getHandler().name}`,
    );

    return next.handle().pipe(
      tap((_res) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;

        const elapsedTime = performance.now() - startTime;

        this.logger.log(
          `Response ${method} | ${url} | ${statusCode} | Duration: ${elapsedTime} ms  | ${userAgent} | ${ip}`,
        );
      }),
    );
  }
}
