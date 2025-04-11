import { Module } from "@nestjs/common";
import { UserUseCasesModule } from "@repo/fm-application";

import { UserMapper } from "./common/user.mapper";
import { UserAdminController } from "./user-admin.controller";
import { UserSharedController } from "./user-shared.controller";

@Module({
  imports: [UserUseCasesModule.forRootAsync({ global: true })],
  providers: [UserMapper],
  controllers: [UserAdminController, UserSharedController],
})
export class UserModule {}
