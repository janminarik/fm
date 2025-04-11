import { STATUS_CODES } from "http";

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
  ValidationError,
} from "@nestjs/common";

import { ErrorDto, ValidationErrorDto } from "../dto";

@Injectable()
export class ExceptionHandlerService {
  protected handleHttpException(exception: HttpException): ErrorDto {
    const statusCode = exception.getStatus();

    return {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode] ?? "Unknow error",
      message: exception.message,
    };
  }

  protected handleError(error: Error): ErrorDto {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode] ?? "Unknow error",
      message: error?.message || "An unexpected error occurred",
    };
  }

  protected flattenValidationErrors(errors: ValidationError[]): string[] {
    const messages = errors?.map((error) => {
      const constraints = error.constraints
        ? Object.values(error.constraints).join(", ")
        : "unknown constraint";

      return `${error.property} has wrong value ${error.value}, ${constraints}`;
    });

    return messages || [];
  }
  protected handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ): ValidationErrorDto {
    const r = exception.getResponse() as { message: ValidationError[] };
    const validationErrors = r?.message;

    const statusCode = exception.getStatus();

    return {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode] ?? "Unknow error",
      message: "Validation error",
      details: this.flattenValidationErrors(validationErrors),
    };
  }

  handleException(exception: unknown, debug: boolean): ErrorDto {
    let error: ErrorDto;

    if (exception instanceof UnprocessableEntityException) {
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else if (exception instanceof Error) {
      error = this.handleError(exception);
    } else {
      error = this.handleError(new Error("Unknown exception occurred"));
    }

    if (debug && exception instanceof Error) {
      if (error) {
        error.stack = exception.stack;
        error.exception = exception;
      }
    }

    return error;
  }
}
