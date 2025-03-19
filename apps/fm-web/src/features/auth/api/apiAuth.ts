import { createApi } from "@reduxjs/toolkit/query/react";

import { AppDispatch } from "../../../app/store";
import { clearAppErrors } from "../../../shared/slices/appErrorSlice";
import { resetNofications } from "../../../shared/slices/notificationSlice";
import { LoginResponseDto } from "../../../shared/types/commonTypes";
import { apiBaseQuery } from "../../../shared/utils/reduxUtils";
import { apiUser } from "../../user/api/userApi";

const loginUser = async (dispatch: AppDispatch) => {
  await dispatch(apiUser.util.resetApiState());
  await dispatch(clearAppErrors());
  await dispatch(resetNofications());
};

export const apiAuth = createApi({
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    checkAuth: builder.query<{ isAuthenticated: boolean }, void>({
      providesTags: (result) =>
        result
          ? [{ id: "STATUS", type: "Auth" }]
          : [{ id: "STATUS", type: "Auth" }],
      query: () => "/auth/checkAuth",
      keepUnusedDataFor: 0, //necachovat
    }),

    refresh: builder.mutation<{ response: LoginResponseDto }, void>({
      query: (body) => ({
        body,
        method: "POST",
        url: "/auth/refresh",
      }),
    }),

    login: builder.mutation<
      { response: LoginResponseDto },
      { email: string; password: string }
    >({
      invalidatesTags: [{ id: "STATUS", type: "Auth" }],
      query: (body) => ({
        body,
        method: "POST",
        url: "/auth/login",
      }),
      async onQueryStarted(_, { dispatch }) {
        await loginUser(dispatch);
      },
    }),

    logout: builder.mutation<void, void>({
      invalidatesTags: [{ id: "STATUS", type: "Auth" }],
      query: (body) => ({
        body,
        method: "POST",
        url: "/auth/logout",
      }),
    }),
  }),
  reducerPath: "authApi",
  tagTypes: ["Auth"],
});

export const { useCheckAuthQuery, useLoginMutation, useLogoutMutation } =
  apiAuth;
