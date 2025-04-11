import { DynamicModule, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";

import { BaseLoggerConfig } from "./config";
import { LoggerConfigProvider } from "./types/logger-config-provider";

export interface LoggersConfigModuleOptions {
  configProviders: LoggerConfigProvider<BaseLoggerConfig>[];
  isGlobal: boolean;
}

export class LoggersConfigModule {
  static forRoot(options: LoggersConfigModuleOptions): DynamicModule {
    const configModules = options.configProviders.map((def) =>
      ConfigModule.forFeature(registerAs(def.namespace, def.configFactory)),
    );

    const providers: Provider[] = options.configProviders.map((def) => ({
      inject: [ConfigService],
      provide: def.provideToken,
      useFactory: (configService: ConfigService) =>
        configService.get<string>(def.namespace),
    }));

    return {
      global: options.isGlobal,
      module: LoggersConfigModule,
      imports: [ConfigModule, ...configModules],
      providers: providers,
      exports: providers,
    };
  }
}
