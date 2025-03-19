import { ApiProperty } from "@nestjs/swagger";
import { randUuid } from "@ngneat/falso";
import { Expose } from "class-transformer";
import { IsDate, IsOptional, IsUUID } from "class-validator";

export class BaseEntityDto {
  @ApiProperty({ type: () => Number, required: true, example: randUuid() })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({ type: () => Date })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
