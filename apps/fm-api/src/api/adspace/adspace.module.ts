import { Module } from "@nestjs/common";
import { AdSpaceUseCasesModule } from "@repo/fm-application";

import { AdSpaceControllerV1 } from "./adspace.controller.v1";
import { AdSpaceMapper } from "./adspace.mapper";

@Module({
  imports: [AdSpaceUseCasesModule],
  providers: [AdSpaceMapper],
  controllers: [AdSpaceControllerV1],
})
export class AdSpaceModule {}
