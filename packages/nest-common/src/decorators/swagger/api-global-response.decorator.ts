import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export function ApiGlobalResponse() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: "Bad request (validation error).",
    }),
    ApiResponse({
      status: 500,
      description: "Internal server error.",
    }),
  );
}
