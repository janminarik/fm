import { Module } from "@nestjs/common";
import { UserUseCasesModule } from "@repo/fm-application";

import { AdSpaceModule } from "./adspace/adspace.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [HealthModule, AuthModule, AdSpaceModule, UserModule],
})
export class ApiModule {}
