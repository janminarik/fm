import { OmitType } from "@nestjs/swagger";
import { AddressDto } from "./address.dto";

export class CreateAddressDto extends OmitType(AddressDto, [
  "id",
  "createdAt",
  "updatedAt",
]) {}
