import { Module } from "@nestjs/common";
import { UserUseCasesModule } from "@repo/fm-application";
import { UserMapper } from "./common/user.mapper";
import { UserAdminController } from "./user-admin.controller";
import { UserSharedController } from "./user-shared.controller";
import { UserController } from "./user.controller";

@Module({
  imports: [UserUseCasesModule.forRootAsync({ global: true })],
  providers: [UserMapper],
  controllers: [UserAdminController, UserSharedController, UserController],
})
export class UserModule {}
