import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { AdSpaceDto } from "./adspace.dto";
import { CreateAddressDto } from "./create-address.dto";

export class CreateAdSpaceDto extends OmitType(AdSpaceDto, [
  "id",
  "createdAt",
  "updatedAt",
  "address",
]) {
  @ApiProperty({ type: () => CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
