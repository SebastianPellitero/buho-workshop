import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse, CreateOrderPayload, OrderDTO } from "@/types";

interface CreateOrderResult {
  orderId: string;
  clientSecret: string;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResult, CreateOrderPayload>({
      query: (payload) => ({
        url: "/orders",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: ApiResponse<CreateOrderResult>) => {
        if (res.error) throw new Error(res.error);
        return res.data!;
      },
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    getOrders: builder.query<OrderDTO[], void>({
      query: () => "/orders",
      transformResponse: (res: ApiResponse<OrderDTO[]>) => {
        if (res.error) throw new Error(res.error);
        return res.data!;
      },
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrdersQuery } = ordersApi;
