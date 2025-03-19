import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { ExceptionHandlerService } from "@repo/nest-common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private exceptionHandlerService: ExceptionHandlerService,
    private readonly debug: boolean,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();

    const error = this.exceptionHandlerService.handleException(
      exception,
      this.debug,
    );

    this.logger.error(error);

    httpAdapter.reply(context.getResponse(), error, error.statusCode);
  }
}
