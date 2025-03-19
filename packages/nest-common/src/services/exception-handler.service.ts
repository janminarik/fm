import { STATUS_CODES } from "http";

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
  ValidationError,
} from "@nestjs/common";

import { ErrorDto, ValidatioErrorDto } from "../dto";

@Injectable()
export class ExceptionHandlerService {
  protected handleHttpException(exception: HttpException): ErrorDto {
    const statusCode = exception.getStatus();

    return {
      timestamp: new Date().toISOString(),
      statusCode,
      error: statusCode[statusCode],
      message: exception.message,
    };
  }

  protected handleError(error: Error): ErrorDto {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: error?.message || "An unexpected error occurred",
    };
  }

  protected flattenValidationErrors(errors: ValidationError[]): string[] {
    const messages = errors?.map(
      (error) =>
        `${error.property} has wrong value ${error.value}, ${Object.values(
          error.constraints,
        )}`,
    );

    return messages;
  }

  protected handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ): ValidatioErrorDto {
    const r = exception.getResponse() as { message: ValidationError[] };
    const validationErrors = r?.message;

    const statusCode = exception.getStatus();

    return {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: "Validation error",
      details: this.flattenValidationErrors(validationErrors),
    };
  }

  handleException(exception: any, debug: boolean): ErrorDto {
    let error: ErrorDto;

    if (exception instanceof UnprocessableEntityException) {
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else {
      error = this.handleError(exception);
    }

    if (debug) {
      error.stack = exception.stack;
      error.trace = exception;
    }

    return error;
  }
}
