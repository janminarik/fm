import { Module, RequestMethod } from "@nestjs/common";
import {
  BASE_LOGGER_CONFIG,
  BaseLoggerConfig,
  FILE_LOGGER_CONFIG,
  FileLoggerConfig,
  fileLoggerConfigProvider,
  loggerConfigProvider,
  LoggersConfigModule,
  LOKI_LOGGER_CONFIG,
  LokiLoggerConfig,
  lokiLoggerConfigProvider,
} from "@repo/nest-common";
import {
  createPinoLoki,
  createPinoPretty,
  createPinoRoll,
  PinoOptionsModule,
  PinoOptionsService,
} from "@repo/nest-pino";
import { LoggerModule as PinoModule } from "nestjs-pino";
import { TransportTargetOptions } from "pino";

const loggersConfigModule = LoggersConfigModule.forRoot({
  isGlobal: true,
  configProviders: [
    loggerConfigProvider,
    fileLoggerConfigProvider,
    lokiLoggerConfigProvider,
  ],
});

const createPinoLoggerOptions = (
  baseLoggerConfig: BaseLoggerConfig,
  fileLoggerConfig: FileLoggerConfig,
  lokiLoggerConfig: LokiLoggerConfig,
  pinoOptionsService: PinoOptionsService,
) => {
  const targets: TransportTargetOptions[] = [
    createPinoPretty(baseLoggerConfig),
    createPinoRoll(fileLoggerConfig),
    createPinoLoki(lokiLoggerConfig),
  ];

  const loggerOptions = pinoOptionsService.create(baseLoggerConfig, {
    targets,
  });

  return {
    ...loggerOptions,
    exclude: [{ method: RequestMethod.ALL, path: "health-check" }],
  };
};

const pinoLoggerModule = PinoModule.forRootAsync({
  imports: [PinoOptionsModule],
  inject: [
    BASE_LOGGER_CONFIG,
    FILE_LOGGER_CONFIG,
    LOKI_LOGGER_CONFIG,
    PinoOptionsService,
  ],
  useFactory: createPinoLoggerOptions,
});

@Module({ imports: [loggersConfigModule, pinoLoggerModule] })
export class LoggerModule {}
