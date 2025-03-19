import { Module } from "@nestjs/common";

import { CreateAdSpaceUseCase } from "./create-ad-space.usecase";
import { DeleteAdSpaceUseCase } from "./delete-ad-space.usecase";
import { GetAdSpaceUseCase } from "./get-ad-space.usecase";
import { ListAdSpaceUseCase } from "./list-ad-space.usecase";
import { UpdateAdSpaceUseCase } from "./update-ad-space.usecase";

const useCases = [
  CreateAdSpaceUseCase,
  UpdateAdSpaceUseCase,
  GetAdSpaceUseCase,
  DeleteAdSpaceUseCase,
  ListAdSpaceUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class AdSpaceUseCasesModule {}
