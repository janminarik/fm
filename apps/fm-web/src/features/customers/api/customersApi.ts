import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  buildSearchParams,
  QueryParams,
} from "../../../shared/utils/reduxUtils";
import { CreateCustomer, Customer } from "../types/customer";

const apiBaseUrl = import.meta.env.VITE_CUSTOMERS_API_BASE_URL;

export type CustomerQueryParams = QueryParams<Customer>;

export const apiCustomers = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    createCustomer: builder.mutation<Customer, CreateCustomer>({
      invalidatesTags: (result) =>
        result ? [{ id: "LIST", type: "Customer" }] : [],
      query: (body) => ({
        body,
        method: "POST",
        url: "/customers",
      }),
    }),

    deleteCustomer: builder.mutation<void, string>({
      invalidatesTags: (result, error, id) => [
        { id: "LIST", type: "Customer" },
      ],
      query: (id) => ({
        method: "DELETE",
        url: `/customers/${id}`,
      }),
    }),

    getCustomerById: builder.query<Customer, string>({
      providesTags: (result, error, id) => [{ id, type: "Customer" }],
      query: (id) => `/customers/${id}`,
    }),

    getCustomers: builder.query<
      { items: Customer[]; totalCount: number },
      CustomerQueryParams | void
    >({
      providesTags: (result) =>
        result
          ? [
              { id: "LIST", type: "Customer" },
              ...result.items.map((customer) => ({
                id: customer.id,
                type: "Customer" as const,
              })),
            ]
          : [],
      query: (queryParams) =>
        queryParams
          ? `/customers?${buildSearchParams(queryParams)}`
          : "/customers",
    }),

    updateCustomer: builder.mutation<
      Customer,
      { body: Partial<Customer>; id: string }
    >({
      invalidatesTags: (result, error, { id }) => [{ id, type: "Customer" }],
      query: ({ body, id }) => ({
        body,
        method: "PATCH",
        url: `/customers/${id}`,
      }),
    }),
  }),
  reducerPath: "customers",
  tagTypes: ["Customer"],
});

export const {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerByIdQuery,
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useUpdateCustomerMutation,
} = apiCustomers;
