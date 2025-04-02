import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  AD_SPACE_REPOSITORY,
  APP_TOKEN_REPOSITORY,
  USER_REPOSITORY,
} from "@repo/fm-domain";
import { IBaseModuleOptions } from "@repo/fm-shared";

import { AdSpaceMapper, AppTokenMapper, UserMapper } from "./mappers";
import { PrismaContextProvider } from "./providers";
import { prismaAdSpaceRepositoryProvider } from "./repositories";
import { prismaAppTokenProvider } from "./repositories/prisma-app-token.repository";
import { prismaUserRepositoryProvider } from "./repositories/prisma-user.repository";
import { PrismaService } from "./services/prisma.service";

export interface IPrismaModuleOptions extends IBaseModuleOptions {
  dbUrl?: string;
}

@Module({})
export class PrismaModule {
  static forRootAsync(options?: IPrismaModuleOptions): DynamicModule {
    return {
      module: PrismaModule,
      global: options?.global,
      imports: [ConfigModule],
      providers: [
        {
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const dbUrl = options?.dbUrl || configService.get("DB_URL");
            if (!dbUrl) {
              throw new Error("DB url must be defined");
            }
            return new PrismaService(dbUrl);
          },
          provide: PrismaService,
        },
        PrismaContextProvider,
        prismaUserRepositoryProvider,
        prismaAppTokenProvider,
        prismaAdSpaceRepositoryProvider,
        AdSpaceMapper,
        UserMapper,
        AppTokenMapper,
      ],
      exports: [
        PrismaService,
        USER_REPOSITORY,
        APP_TOKEN_REPOSITORY,
        AD_SPACE_REPOSITORY,
      ],
    };
  }
}
