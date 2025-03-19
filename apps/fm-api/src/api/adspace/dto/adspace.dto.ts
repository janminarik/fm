import { ApiProperty } from "@nestjs/swagger";
import { AdSpaceStatus, AdSpaceType, AdSpaceVisibility } from "@repo/fm-domain";
import { Expose, Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { BaseEntityDto } from "../../../common/dto";
import { AddressDto } from "./address.dto";

export class AdSpaceDto extends BaseEntityDto {
  @ApiProperty({ type: () => String, required: true })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({
    enum: AdSpaceType,
    required: true,
    default: AdSpaceType.BILLBOARD,
  })
  @IsNotEmpty()
  @IsEnum(AdSpaceType)
  @Expose()
  type: AdSpaceType;

  @ApiProperty({
    enum: AdSpaceVisibility,
    required: true,
    default: AdSpaceVisibility.HIGH,
  })
  @IsNotEmpty()
  @IsEnum(AdSpaceVisibility)
  @Expose()
  visibility: AdSpaceVisibility;

  @ApiProperty({
    enum: AdSpaceStatus,
    required: true,
    default: AdSpaceStatus.AVAILABLE,
  })
  @IsNotEmpty()
  @IsEnum(AdSpaceStatus)
  @Expose()
  status: AdSpaceStatus;

  @ApiProperty({ type: () => AddressDto, required: true })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @Expose()
  address: AddressDto;
}
