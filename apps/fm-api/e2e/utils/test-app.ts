import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  HttpStatus,
  LogLevel,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { IUserRepository, USER_REPOSITORY } from "@repo/fm-domain";
import { createUserPayloadFake } from "@repo/fm-mock-data";
import { HASH_SERVICE, IHashService } from "@repo/fm-shared";
import {
  ExceptionHandlerService,
  RequestContextInterceptor,
} from "@repo/nest-common";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

import { AppModule } from "../../src/app.module";
import { GlobalExceptionFilter } from "../../src/common/global-exception.filter";
import { AppConfig } from "../../src/config/app.config";

const VALIDATE_DTO = true;

export async function createTestApp() {
  config({ path: "../../.env.test" });

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const configService = app.get(ConfigService<AppConfig>);

  //* Testing logger
  const logger = new TestLogger(configService);
  app.useLogger(logger);

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

  if (VALIDATE_DTO) {
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
  }

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

  app.setGlobalPrefix("api", { exclude: ["health", "/"] });

  await app.init();

  return app;
}

export async function createTestUser(): Promise<TestUser> {
  const app = await createTestApp();
  const userRepository: IUserRepository = app.get(USER_REPOSITORY);
  const hashService: IHashService = app.get(HASH_SERVICE);

  const createUserDto = createUserPayloadFake();

  const passwordHash = await hashService.hash(createUserDto.password);

  const user = await userRepository.create({
    ...createUserDto,
    passwordHash: passwordHash,
  });

  if (user) {
    const testUser: TestUser = {
      id: user.id,
      email: user.email,
      password: createUserDto.password,
      userName: user.userName || "",
    };
    return testUser;
  } else {
    throw new Error(
      "Failed to create test user. User repository returned null or undefined.",
    );
  }
}

export async function deleteTestUser(userId: string) {
  const app = await createTestApp();
  const userRepository = app.get<IUserRepository>(USER_REPOSITORY);

  try {
    await userRepository.delete(userId);
  } catch (error) {
    console.error(`Failed to delete test user ${userId}:`, error);
  }

  await app.close();
}

export class TestUser {
  id: string;
  email: string;
  password: string;
  userName: string;
}

class TestLogger extends ConsoleLogger {
  constructor(private readonly configService: ConfigService<AppConfig>) {
    super();
    const logLevel = this.configService.get<string>("logger.logLevel", {
      infer: true,
    });
    this.setLogLevels([logLevel as LogLevel]);
  }
}
