import { createApi } from "@reduxjs/toolkit/query/react";

import { CurrentUser } from "../../../shared/types/commonTypes";
import { apiBaseQueryWithReAuth } from "../../../shared/utils/reduxUtils";

export const apiUser = createApi({
  baseQuery: apiBaseQueryWithReAuth,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<CurrentUser, void>({
      providesTags: (result) =>
        result ? [{ id: "PROFILE", type: "CurrentUser" }] : [],
      query: () => ({
        method: "GET",
        url: "/user/profile",
      }),
    }),
  }),
  reducerPath: "apiUser",
  tagTypes: ["CurrentUser"],
});

export const { useGetCurrentUserQuery } = apiUser;
