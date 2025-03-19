import { SerializedError } from "@reduxjs/toolkit";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { capitalize } from "./commonUtils";
import { AppError } from "../types/commonTypes";

// #region Base

export const apiBaseQuery: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      // headers.set("Authorization", "JWT TOKEN");
      return headers;
    },
  });

  const apiCallResult = await baseQuery(args, api, extraOptions);

  return apiCallResult;
};

export const apiBaseQueryWithReAuth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const apiCallResult = await apiBaseQuery(args, api, extraOptions);

  //! access token has expired
  if (apiCallResult.error && apiCallResult.error.status === 401) {
    console.log("access token has expired");
    const refreshTokenResult = await apiBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    //!refresh token failed
    if (refreshTokenResult.error) {
      console.log("refresh token failed");
      return refreshTokenResult;
    } else {
      console.log("refresh token successful");
      return await apiBaseQuery(args, api, extraOptions);
    }
  }

  return apiCallResult;
};

interface QueryOrMutationState {
  error?: unknown;
  isError?: boolean;
  isFetching?: boolean;
  isLoading?: boolean;
}

export const aggregateApiRequestState = (results: QueryOrMutationState[]) => {
  const isLoading = results.some((r) => r.isLoading || r.isFetching);
  const isError = results.some((r) => r.isError);
  const errors = results
    .map((r) => r.error)
    .filter((error): error is FetchBaseQueryError | SerializedError => !!error);

  return { errors, isError, isLoading };
};

// #endregion

//#region Error

//rtk error
export const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    ("data" in error || "error" in error)
  );
};

//redux error
export function isSerializedError(error: unknown): error is SerializedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "message" in error &&
    typeof (error as SerializedError).name === "string" &&
    typeof (error as SerializedError).message === "string"
  );
}

export const isReduxError = (error: unknown) =>
  isFetchBaseQueryError(error) || isSerializedError(error);

export const hasErrorMessage = (data: unknown): data is { message: string } => {
  return typeof data === "object" && data !== null && "message" in data;
};

export const mapReduxErrorToAppError = (
  error: FetchBaseQueryError | SerializedError,
): AppError => {
  if ("status" in error) {
    // RTK FetchBaseQueryError -  error z fetchovania a parsovania
    if (typeof error.status === "number") {
      const message = hasErrorMessage(error.data)
        ? error.data.message
        : "Unknown server error";
      return new AppError(message, error.status);
    } else {
      return new AppError(error.error, error.status);
    }
  } else if ("message" in error) {
    // SerializedError - error mimo fetchovania a parsovania
    return new AppError(
      error.code || "UNKNOWN_ERROR",
      error.message || "An unknown error occurred",
      error.stack,
    );
  } else {
    return new AppError("UNKNOWN_ERROR", "An unknown error occurred");
  }
};

export const parseReduxError = (
  error: unknown,
  defaultErrorMessage: string,
) => {
  let errorMessage: string = defaultErrorMessage;
  if (isReduxError(error)) {
    const apiError = mapReduxErrorToAppError(error);
    errorMessage = apiError.format();
  }
  return errorMessage;
};

//#endregion

//#region Query
export type Filters<T> = Partial<Record<keyof T, any>>;

export interface QueryParams<T> {
  filters?: Filters<T>;
  page?: number;
  pageSize?: number;
  sortOptions?: SortOptions<T>;
}

export type SortOptions<T> = Array<{
  direction: "asc" | "desc";
  field: keyof T;
}>;

export const buildApiSearchParams = <T>(queryParams: QueryParams<T>) => {
  const query = new URLSearchParams();
  if (queryParams.page) query.append("page", queryParams.page.toString());

  if (queryParams.pageSize)
    query.append("limit", queryParams.pageSize.toString());

  if (queryParams.filters)
    query.append("filter", JSON.stringify(queryParams.filters));

  if (queryParams.sortOptions) {
    const sortingCriteria = queryParams.sortOptions?.[0];
    if (sortingCriteria) {
      query.append("sortBy", sortingCriteria.field.toString());
      query.append(
        "sortOrder",
        sortingCriteria.direction.toString().toUpperCase(),
      );
    }
  }
  const result = query.toString();
  return result;
};

//#endregion

//#region Generic Api
export interface TEntityBase<TId extends number | string> {
  id: TId;
}

//obsolete
export const buildSearchParams = <T>(queryParams: QueryParams<T>) => {
  const query = new URLSearchParams();
  if (queryParams.page) query.append("skip", queryParams.page.toString());

  if (queryParams.pageSize)
    query.append("take", queryParams.pageSize.toString());

  if (queryParams.filters)
    query.append("filter", JSON.stringify(queryParams.filters));

  if (queryParams.sortOptions)
    query.append(
      "orderBy",
      JSON.stringify(
        queryParams.sortOptions.map((sort) => ({
          [sort.field]: sort.direction,
        })),
      ),
    );

  return query.toString();
};

//TODO: query builder swicth toto customn buildSearchParams ako params
export const createGenericApi = <
  TId extends number | string,
  TEntity extends TEntityBase<TId>,
  TCreateEntity extends Partial<TEntity>,
>(
  entityName: string,
  baseUrl: string,
) => {
  const reducerPath = `${entityName.toLowerCase()}s`;
  const entityTag = capitalize(entityName);
  const entityPath = `/${entityName.toLowerCase()}s`;

  const baseApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
    endpoints: (builder) => ({
      createEntity: builder.mutation<TEntity, TCreateEntity>({
        invalidatesTags: (result) =>
          result ? [{ id: "LIST", type: entityTag }] : [],
        query: (body) => ({
          body,
          method: "POST",
          url: entityPath,
        }),
      }),
      deleteEntity: builder.mutation<void, TId>({
        invalidatesTags: (result, error, id) => [
          { id: "LIST", type: entityTag },
        ],
        query: (id) => ({
          method: "DELETE",
          url: `${entityPath}/${id}`,
        }),
      }),
      getEntities: builder.query<
        { items: TEntity[]; totalCount: number },
        QueryParams<TEntity> | void
      >({
        providesTags: (result) =>
          result
            ? [
                { id: "LIST", type: entityTag },
                ...result.items.map((item) => ({
                  id: item.id,
                  type: `${entityTag}` as const,
                })),
              ]
            : [],
        query: (queryParams) =>
          queryParams
            ? `${entityPath}?${buildSearchParams(queryParams)}`
            : `/${entityName.toLowerCase()}`,
      }),
      getEntityById: builder.query<TEntity, TId>({
        providesTags: (result, error, id) => [{ id, type: entityTag }],
        query: (id) => `${entityPath}/${id}`,
      }),
      updateEntity: builder.mutation<
        TEntity,
        { body: Partial<TEntity>; id: TId }
      >({
        invalidatesTags: (result, error, { id }) => [{ id, type: entityTag }],
        query: ({ body, id }) => ({
          body,
          method: "PATCH",
          url: `${entityPath}/${id}`,
        }),
      }),
    }),
    reducerPath: reducerPath,
    tagTypes: [`${capitalize(entityName)}`],
  });

  const {
    useCreateEntityMutation,
    useDeleteEntityMutation,
    useGetEntitiesQuery,
    useGetEntityByIdQuery,
    useUpdateEntityMutation,
  } = baseApi;

  return {
    baseApi,
    reducerPath,
    useCreateEntityMutation,
    useDeleteEntityMutation,
    useGetEntitiesQuery,
    useGetEntityByIdQuery,
    useUpdateEntityMutation,
  };
};

//#endregion
