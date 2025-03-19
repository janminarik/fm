import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  CreateAdSpaceUseCase,
  DeleteAdSpaceUseCase,
  GetAdSpaceUseCase,
  ListAdSpaceUseCase,
  UpdateAdSpaceUseCase,
} from "@repo/fm-application";

import { AdSpaceControllerV1 } from "./adspace.controller.v1";
import { AdSpaceMapper } from "./adspace.mapper";
import Authentication from "../../common/decorators/authentication.decorator";

@ApiTags("adspace")
@Authentication()
@Controller({ version: "2", path: "adspace" })
export class AdSpaceControllerV2 extends AdSpaceControllerV1 {
  constructor(
    getAdSpaceUseCase: GetAdSpaceUseCase,
    createAdSpaceUseCase: CreateAdSpaceUseCase,
    updateAdSpaceUseCase: UpdateAdSpaceUseCase,
    deleteAdSpaceUseCase: DeleteAdSpaceUseCase,
    listAdSpaceUseCase: ListAdSpaceUseCase,
    mapper: AdSpaceMapper,
  ) {
    super(
      getAdSpaceUseCase,
      createAdSpaceUseCase,
      updateAdSpaceUseCase,
      deleteAdSpaceUseCase,
      listAdSpaceUseCase,
      mapper,
    );
  }
}
