import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  Logger,
  NestApplicationOptions,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import {
  ExceptionHandlerService,
  RequestContextInterceptor,
} from "@repo/nest-common";
import compression from "compression";
import cookieParser from "cookie-parser";
import { Logger as PinoLogger } from "nestjs-pino";

import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/global-exception.filter";
import { AppConfig } from "./config/app.config";
import { configureSwagger } from "./swagger";

export function configureApp(app: INestApplication) {
  const configService = app.get(ConfigService<AppConfig>);

  //* Logging
  app.useLogger(app.get(PinoLogger));
  app.flushLogs();
  const logger = new Logger();

  app.enableShutdownHooks();

  //* Compression
  app.use(compression());

  //* Enable CORS
  const corsOrigin = configService.getOrThrow("app.corsOrigin", {
    infer: true,
  });

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  app.use(cookieParser());

  app.useGlobalInterceptors(
    new RequestContextInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new GlobalExceptionFilter(
      app.get(HttpAdapterHost),
      app.get(ExceptionHandlerService),
      configService.getOrThrow("app.debug", { infer: true }),
    ),
  );

  //* Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  //* Swagger
  const enableSwagger = configService.getOrThrow("app.apiDocsEnabled", {
    infer: true,
  });

  if (enableSwagger) configureSwagger(app);

  app.setGlobalPrefix("api", { exclude: ["health", "/"] });

  //* Port
  const port = configService.getOrThrow("app.port", { infer: true });

  const appName = configService.getOrThrow("app.name", { infer: true });

  logger.log(`${appName} is running on port ${port}`);
  logger.log(`CORS origin: ${corsOrigin.toString()}`);
}

async function bootstrap() {
  const nestOptions: NestApplicationOptions = {
    bodyParser: false,
  };

  const app = await NestFactory.create(AppModule, nestOptions);

  configureApp(app);

  const port = app
    .get(ConfigService<AppConfig>)
    .getOrThrow("app.port", { infer: true });

  await app.listen(port);
}

void bootstrap();
