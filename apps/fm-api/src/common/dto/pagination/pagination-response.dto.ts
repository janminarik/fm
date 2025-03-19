import { ApiProperty } from "@nestjs/swagger";
import { IListPaginationResult, IPaginationMeta } from "@repo/fm-domain";

export class PaginationMetaDto implements IPaginationMeta {
  @ApiProperty({ description: "Number of items on the current page" })
  count: number;

  @ApiProperty({ description: "Total number of records" })
  total: number;

  @ApiProperty({ description: "Current page number" })
  page: number;

  @ApiProperty({ description: "Total number of pages" })
  totalPage: number;
}

export class PaginationResponseDto<T> implements IListPaginationResult<T> {
  @ApiProperty({
    description: "The list of items matching the query",
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: "Metadata about the pagination.",
  })
  meta: PaginationMetaDto;
}
