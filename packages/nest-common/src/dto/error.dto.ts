import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ErrorDto {
  @ApiProperty({ description: "Timestamp of when the error occurred" })
  timestamp: string;

  @ApiProperty({ description: "HTTP status code of the error response" })
  statusCode: number;

  @ApiProperty({ description: "A error message" })
  error: string;

  @ApiProperty({ description: "A detailed error message." })
  message: string;

  /**
   * Only for debug mode
   */
  stack?: string;

  /**
   * Onlye for debug mode
   */
  trace?: Error | unknown;
}

export class ValidatioErrorDto extends ErrorDto {
  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: "A record of validation errors keyed by field name",
  })
  details?: string[];
}
