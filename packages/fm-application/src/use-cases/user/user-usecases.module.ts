import { DynamicModule, Module } from "@nestjs/common";
import { CryptoModule, IBaseModuleOptions } from "@repo/fm-shared";

import { CreateUserUseCase } from "./create-user.usecase";
import { GetUserByEmailUseCase } from "./get-user-by-email.usecase";
import { GetUserByIdUseCase } from "./get-user-by-id.usecase";

const useCases = [CreateUserUseCase, GetUserByIdUseCase, GetUserByEmailUseCase];

@Module({})
export class UserUseCasesModule {
  static forRootAsync(options?: IBaseModuleOptions): DynamicModule {
    return {
      module: UserUseCasesModule,
      imports: [CryptoModule],
      providers: [...useCases, ...(options?.providers ?? [])],
      exports: [...useCases],
    };
  }
}
