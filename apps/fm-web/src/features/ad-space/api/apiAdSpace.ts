import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginationResponse } from "../../../shared/types/commonTypes";
import {
  apiBaseQueryWithReAuth,
  buildApiSearchParams,
  QueryParams,
} from "../../../shared/utils/reduxUtils";
import { AdSpace } from "../types/ad-space";
import { CreateAdSpaceDto } from "../types/create-ad-space.dto";
import { UpdateAdSpaceDto } from "../types/update-ad-space.dto";

export type AdSpaceQueryParams = QueryParams<AdSpace>;

export const apiAdSpace = createApi({
  baseQuery: apiBaseQueryWithReAuth,
  endpoints: (builder) => ({
    createAdSpace: builder.mutation<AdSpace, CreateAdSpaceDto>({
      invalidatesTags: (result) =>
        result ? [{ id: "LIST", type: "AdSpace" }] : [],
      query: (body) => ({
        body,
        method: "POST",
        url: "/adspace/create",
      }),
    }),
    deleteAdSpace: builder.mutation<boolean | void, string>({
      invalidatesTags: (result) =>
        result === true ? [{ id: "LIST", type: "AdSpace" }] : [],
      query: (id) => ({
        method: "DELETE",
        url: `/adspace/${id}`,
      }),
      transformResponse: (response, meta, arg) => {
        if (meta?.response?.status === 204) {
          return true;
        }
      },
    }),
    getAdSpaceById: builder.query<AdSpace, string>({
      providesTags: (result, error, id) => [{ id, type: "AdSpace" }],
      query: (id) => `adspace/${id}`,
    }),
    getAdSpaces: builder.query<
      PaginationResponse<AdSpace>,
      AdSpaceQueryParams | void
    >({
      providesTags: (result) =>
        result
          ? [
              { id: "LIST", type: "AdSpace" },
              ...result.data.map((adspace) => ({
                id: adspace.id,
                type: "AdSpace" as const,
              })),
            ]
          : [],
      query: (queryParams) =>
        queryParams
          ? `/adspace/list?${buildApiSearchParams(queryParams)}`
          : "/adspace",
      // transformResponse: (response: PaginationResponse<AdSpace>) => {
      //   return {
      //     items: response.data,
      //     totalCount: response.meta.total,
      //   };
      // },
    }),
    updateAdSpace: builder.mutation<
      AdSpace,
      { body: UpdateAdSpaceDto; id: string }
    >({
      invalidatesTags: ["AdSpace"],
      query: ({ body, id }) => ({
        body,
        method: "PATCH",
        url: `adspace/${id}`,
      }),
    }),
  }),
  reducerPath: "adspace",
  tagTypes: ["AdSpace"],
});

export const {
  useCreateAdSpaceMutation,
  useDeleteAdSpaceMutation,
  useGetAdSpaceByIdQuery,
  useGetAdSpacesQuery,
  useUpdateAdSpaceMutation,
} = apiAdSpace;
