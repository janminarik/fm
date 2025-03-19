import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { jwtAuthConfig, JwtAuthModule } from "@repo/fm-auth";
import { PrismaModule, PrismaService } from "@repo/fm-db";
import {
  apiConfig,
  ExceptionHandlerService,
  LoggingInterceptor,
} from "@repo/nest-common";
import { ClsModule } from "nestjs-cls";
import { ApiModule } from "./api/api.module";
import { LoggerModule } from "./logger.module";
import { AppMiddleWareModule } from "./middlewares/app.middleware.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, jwtAuthConfig],
    }),
    LoggerModule,
    AppMiddleWareModule,
    PrismaModule.forRootAsync({ global: true }),
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
    JwtAuthModule.forRootAsync({
      global: true,
    }),
    ApiModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    ExceptionHandlerService,
  ],
})
export class AppModule implements OnApplicationShutdown {
  private logger = new Logger(AppModule.name);

  onApplicationShutdown(signal?: string) {
    if (signal) {
      this.logger.log("Received shutdown signal:" + signal);
    }
  }
}
