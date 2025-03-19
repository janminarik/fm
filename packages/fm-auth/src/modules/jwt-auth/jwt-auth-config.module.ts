import { Module } from "@nestjs/common";

import { AUTH_CONFIG, jwyAuthConfigService } from "./config";

@Module({
  providers: [jwyAuthConfigService],
  exports: [AUTH_CONFIG],
})
export class AuthConfigModule {}
