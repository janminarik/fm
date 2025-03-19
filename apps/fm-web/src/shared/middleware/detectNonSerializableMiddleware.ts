import { isPlainObject, Middleware } from "@reduxjs/toolkit";

export const detectNonSerializableMiddleware: Middleware =
  () => (next) => (action) => {
    if (action && typeof action === "object" && !Array.isArray(action)) {
      Object.keys(action).forEach((key) => {
        const value = (action as Record<string, unknown>)[key];
        if (
          !isPlainObject(value) &&
          typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean" &&
          value !== null
        ) {
          console.warn("Non-serializable value detected in action:", {
            key,
            value,
          });
        }
      });
    }
    return next(action);
  };
