import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

function handlePrismaError(
  error: any,
  entityId?: string,
  entityName?: string,
): never {
  const modelName = entityName || "record";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Get meta information from the error
    const meta = error.meta || {};
    const target = meta.target ? (meta.target as string[]).join(", ") : "";
    const modelInfo =
      typeof meta.modelName === "string" ? meta.modelName : modelName;

    switch (error.code) {
      // Unique constraint violations
      case "P2002": {
        const fields = target || "unique field";
        throw new ConflictException(
          `${modelInfo} with this ${fields} already exists.`,
        );
      }

      // Record not found
      case "P2025":
        throw new NotFoundException(
          `${modelInfo}${entityId ? ` with ID ${entityId}` : ""} not found.`,
        );

      // Foreign key constraint failures
      case "P2003": {
        const field =
          typeof meta.field_name === "string"
            ? meta.field_name
            : meta.field_name?.toString() || "";

        throw new BadRequestException(
          `Related record for field ${field} does not exist.`,
        );
      }

      // Value too long
      case "P2000": {
        const field =
          typeof meta.field_name === "string"
            ? meta.field_name
            : meta.field_name?.toString() || "";
        throw new UnprocessableEntityException(
          `Value for ${field} is too long.`,
        );
      }

      // Required relation violation
      case "P2014": {
        const relations =
          typeof meta.relation_name === "string"
            ? meta.relation_name
            : meta.relation_name?.toString() || "";

        throw new BadRequestException(
          `Required relation ${relations} is missing or invalid.`,
        );
      }

      // Required field not found
      case "P2016":
        throw new BadRequestException(`Required field missing in query.`);

      // Inconsistent type in query
      case "P2023":
        throw new BadRequestException(`Inconsistent data type in query.`);

      // Query parsing failed
      case "P2010":
      case "P2011":
        throw new BadRequestException(`Invalid query format: ${error.message}`);

      // Database constraint violations
      case "P2004":
      case "P2005":
      case "P2006":
      case "P2007":
      case "P2008":
        throw new BadRequestException(`Invalid data: ${error.message}`);

      // DB constraint error
      case "P2009":
        throw new BadRequestException(
          `Database constraint violated: ${error.message}`,
        );

      // Default case for other Prisma errors
      default:
        throw new InternalServerErrorException(
          `Database error (${error.code}): ${error.message}`,
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestException(`Validation error: ${error.message}`);
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    throw new InternalServerErrorException(
      `Critical Prisma client error: ${error.message}`,
    );
  }

  // For other types of errors
  throw error;
}

export function PrismaErrorHandler() {
  return function <T, A extends any[], R>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(this: T, ...args: A) => Promise<R>>,
  ) {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (this: T, ...args: A): Promise<R> {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          const entityId =
            args.length > 0 && typeof args[0] === "string"
              ? args[0]
              : undefined;
          handlePrismaError(error, entityId);
        }
        throw error;
      }
    };

    return descriptor;
  };
}
