import { JwtAuthConfig } from "@repo/fm-auth";
import { ApiConfig, BaseLoggerConfig } from "@repo/nest-common";

export type AppConfig = {
  app: ApiConfig;
  auth: JwtAuthConfig;
  logger: BaseLoggerConfig;
};
