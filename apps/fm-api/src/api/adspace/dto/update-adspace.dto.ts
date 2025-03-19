import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateAdSpaceDto } from "./create-adspace.dto";

export class UpdateAdSpaceDto extends PartialType(
  OmitType(CreateAdSpaceDto, ["address"]),
) {}
