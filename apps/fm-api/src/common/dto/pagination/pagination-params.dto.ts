import { ApiPropertyOptional } from "@nestjs/swagger";
import { IListPaginationParams, SortDirection } from "@repo/fm-domain";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class ListPaginationParams implements IListPaginationParams {
  @ApiPropertyOptional({
    type: () => Number,
    description: "Max items per page (minimum 1)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? parseInt(String(value), 10) : undefined))
  limit?: number;

  @ApiPropertyOptional({
    type: () => Number,
    description: "Page number for pagination (starting at 0)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Transform(({ value }) => (value ? parseInt(String(value), 10) : undefined))
  page?: number;

  @ApiPropertyOptional({
    type: () => String,
    description: "Field to sort by",
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    enum: SortDirection,
    description: "Sort order",
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortDirection)
  sortOrder?: SortDirection;

  @ApiPropertyOptional({
    type: () => String,
    description: "Text filter to narrow down results (MUI)",
  })
  @IsString()
  @IsOptional()
  filter: string;
}
