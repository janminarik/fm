import { applyDecorators, HttpStatus, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiOperationOptions,
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from "@nestjs/swagger";
import { ErrorDto } from "../dto";

export function GetDefaultDescription(
  statusCode: number | "default" | "1XX" | "2XX" | "3XX" | "4XX" | "5XX",
): string {
  let description;
  switch (statusCode) {
    // 2XX Success
    case 200:
      description = "OK";
      break;
    case 201:
      description = "Created";
      break;
    case 202:
      description = "Accepted";
      break;
    case 203:
      description = "Non-Authoritative Information";
      break;
    case 204:
      description = "No Content";
      break;
    case 205:
      description = "Reset Content";
      break;
    case 206:
      description = "Partial Content";
      break;

    // 3XX Redirection
    case 301:
      description = "Moved Permanently";
      break;
    case 302:
      description = "Found";
      break;
    case 303:
      description = "See Other";
      break;
    case 304:
      description = "Not Modified";
      break;
    case 305:
      description = "Use Proxy";
      break;
    case 307:
      description = "Temporary Redirect";
      break;
    case 308:
      description = "Permanent Redirect";
      break;

    // 4XX Client Errors
    case 400:
      description = "Bad Request";
      break;
    case 401:
      description = "Unauthorized";
      break;
    case 402:
      description = "Payment Required";
      break;
    case 403:
      description = "Forbidden";
      break;
    case 404:
      description = "Not Found";
      break;
    case 405:
      description = "Method Not Allowed";
      break;
    case 406:
      description = "Not Acceptable";
      break;
    case 407:
      description = "Proxy Authentication Required";
      break;
    case 408:
      description = "Request Timeout";
      break;
    case 409:
      description = "Conflict";
      break;
    case 410:
      description = "Gone";
      break;
    case 411:
      description = "Length Required";
      break;
    case 412:
      description = "Precondition Failed";
      break;
    case 413:
      description = "Payload Too Large";
      break;
    case 414:
      description = "URI Too Long";
      break;
    case 415:
      description = "Unsupported Media Type";
      break;
    case 416:
      description = "Range Not Satisfiable";
      break;
    case 417:
      description = "Expectation Failed";
      break;
    case 422:
      description = "Unprocessable Entity";
      break;

    // 5XX Server Errors
    case 500:
      description = "Internal Server Error";
      break;
    case 501:
      description = "Not Implemented";
      break;
    case 502:
      description = "Bad Gateway";
      break;
    case 503:
      description = "Service Unavailable";
      break;
    case 504:
      description = "Gateway Timeout";
      break;
    case 505:
      description = "HTTP Version Not Supported";
      break;

    // Default case
    default:
      description = "OK";
      break;
  }

  return description;
}

export function DocOperation(options: ApiOperationOptions): MethodDecorator {
  return applyDecorators(ApiOperation({ ...options }));
}

export type IDocResponseOptions<T = any> = ApiResponseOptions & {
  dto?: T;
};

export function DocResponse(options: IDocResponseOptions): MethodDecorator {
  const status = options?.status ?? HttpStatus.OK;
  const description = options?.description ?? GetDefaultDescription(status);

  return applyDecorators(
    ApiResponse({
      ...options,
      status,
      description,
      ...(options?.dto && { type: options.dto }),
    }),
  );
}

export function DocError<ErrorDto>(
  options: ApiResponseOptions,
  errorDto?: new () => ErrorDto,
): MethodDecorator {
  return applyDecorators(
    DocResponse({ ...options, type: errorDto ?? ErrorDto }),
  );
}

export function DocErrors(docs: MethodDecorator[]) {
  return applyDecorators(...docs);
}

const ApiPaginatedResponse = <
  TResponseDto extends Type<unknown>,
  TDataDto extends Type<unknown>,
>(
  responseDto: TResponseDto,
  dataDto: TDataDto,
  options?: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(responseDto, dataDto),
    ApiResponse({
      ...options,
      status: options?.status ?? HttpStatus.OK,
      schema: {
        allOf: [
          { $ref: getSchemaPath(responseDto) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );

export function DocPaginatedResponse<
  TResponseDto extends Type<unknown>,
  TDataDto extends Type<unknown>,
>(
  responseDto: TResponseDto,
  dataDto: TDataDto,
  options?: ApiResponseOptions,
): MethodDecorator {
  return applyDecorators(ApiPaginatedResponse(responseDto, dataDto, options));
}
