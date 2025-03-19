import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { setAppError, setUnauthorized } from "../slices/appErrorSlice";
import { AppError } from "../types/commonTypes";
import { mapReduxErrorToAppError } from "../utils/reduxUtils";

// ! Redux middleware sa vykonáva mimo kontextu Reactu.
// ! Chyby vyvolané v middleware nebudú prenesené do React komponentov, a teda ani do ErrorBoundary
export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.debug(
      `ReduxError Handling Middleware: ${JSON.stringify(action.payload)}`,
    );

    let appError: AppError | null = null;

    if (action.payload instanceof AppError) {
      appError = action.payload;
    } else {
      const rtkError = action.payload as FetchBaseQueryError;
      if (rtkError != undefined) {
        appError = mapReduxErrorToAppError(rtkError);
      }
    }

    if (appError != null) {
      if (appError.code === 401) store.dispatch(setUnauthorized(true));
      store.dispatch(setAppError(appError.toPlain()));
    }
  }
  return next(action);
};
