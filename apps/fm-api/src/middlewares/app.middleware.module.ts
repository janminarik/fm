import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule, ThrottlerModuleOptions } from "@nestjs/throttler";
import {
  HelmetMiddleware,
  JsonBodyParserMiddleware,
  RawBodyParserMiddleware,
  RequestIdMiddleware,
  TextBodyParserMiddleware,
  UrlencodedBodyParserMiddleware,
} from "@repo/nest-common";

import { AppConfig } from "../config/app.config";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        _configService: ConfigService<AppConfig>,
      ): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: 60,
            limit: 100,
          },
        ],
      }),
    }),
  ],
})
export class AppMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        HelmetMiddleware,
        RequestIdMiddleware,
        JsonBodyParserMiddleware,
        UrlencodedBodyParserMiddleware,
        TextBodyParserMiddleware,
        RawBodyParserMiddleware,
      )
      .forRoutes("*");
  }
}
