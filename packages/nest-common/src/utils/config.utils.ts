import { ClassConstructor, plainToClass } from "class-transformer";
import { validateSync, ValidationError } from "class-validator";

export function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMsg = errors
      .map((error: unknown) => {
        if (error instanceof ValidationError) {
          return (
            `\nError in ${error.property}:\n` +
            Object.entries(error.constraints || {})
              .map(([key, value]) => `+ ${key}: ${value}`)
              .join("\n")
          );
        }
        return "\nUnknown validation error";
      })
      .join("\n");

    console.error(`\n${errors.toString()}`);
    throw new Error(errorMsg);
  }

  return validatedConfig;
}
