import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseEntityDto } from "../../../common/dto";

export class AddressDto extends BaseEntityDto {
  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  street: string;

  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  city: string;

  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  postalcode: string;

  @ApiProperty({ type: () => String })
  @IsNotEmpty()
  @IsString()
  @Expose()
  country: string;

  @ApiPropertyOptional({ type: () => Number })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  @Expose()
  latitude?: number;

  @ApiPropertyOptional({ type: () => Number })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  @Expose()
  longitude?: number;
}
