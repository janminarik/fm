import { Middleware } from "@reduxjs/toolkit";

export const loggerMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    if (import.meta.env.MODE !== "production")
      console.log("Dispatching action: ", { action });

    const result = next(action);

    if (import.meta.env.MODE !== "production")
      console.log("Updated state: ", storeAPI.getState());

    return result;
  };
