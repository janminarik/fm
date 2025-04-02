import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

function handlePrismaError(error: any, entityId?: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        throw new ConflictException(
          "A record with this unique constraint already exists",
        );
      case "P2025":
        throw new NotFoundException(`Record with ID ${entityId} not found`);
      case "P2003":
        throw new BadRequestException("Related record not found");
      case "P2000":
        throw new BadRequestException("Input value is too long");
    }
  }
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
