import { Module } from "@nestjs/common";
import { UserUseCasesModule } from "@repo/fm-application";
import { JwtAuthModule } from "@repo/fm-auth";
import { CryptoModule } from "@repo/fm-shared";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";

@Module({
  imports: [
    JwtAuthModule.forRootAsync(),
    CryptoModule,
    UserUseCasesModule.forRootAsync(),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
