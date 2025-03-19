import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppError {
  message: string;
  code?: string | number;
}

const MAX_ERRORS_COUNT = 100;

interface AppErrorState {
  errors: AppError[];
  isUnathorized: boolean;
}

const initialState: AppErrorState = {
  errors: [],
  isUnathorized: false,
};

const appErrorSlice = createSlice({
  name: "appError",
  initialState,
  reducers: {
    setAppError: (state: AppErrorState, action: PayloadAction<AppError>) => {
      state.errors?.push(action.payload);
      if (state.errors?.length > MAX_ERRORS_COUNT) state.errors?.shift();
    },
    setUnauthorized: (state: AppErrorState, action: PayloadAction<boolean>) => {
      state.isUnathorized = action.payload;
    },
    clearAppErrors: (state: AppErrorState) => {
      state.errors = [];
      state.isUnathorized = false;
    },
  },
});

export const { setAppError, setUnauthorized, clearAppErrors } =
  appErrorSlice.actions;
export const applicationErrorReducer = appErrorSlice.reducer;
