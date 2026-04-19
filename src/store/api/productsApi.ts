import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  ProductSummary,
  ProductDetail,
  CartItem,
} from "@/types";

interface StockResult {
  variantId: string;
  stockQty: number;
}

interface BulkStockResult {
  variantId: string;
  stockQty: number;
  available: boolean;
  requested: number;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product", "Stock"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductSummary[], string | undefined>({
      query: (category) =>
        category ? `/products?category=${category}` : "/products",
      transformResponse: (res: ApiResponse<ProductSummary[]>) => {
        if (res.error) throw new Error(res.error);
        return res.data!;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProduct: builder.query<ProductDetail, string>({
      query: (productId) => `/products/${productId}`,
      transformResponse: (res: ApiResponse<ProductDetail>) => {
        if (res.error) throw new Error(res.error);
        return res.data!;
      },
      providesTags: (_result, _err, id) => [{ type: "Product", id }],
    }),

    getVariantStock: builder.query<StockResult, string>({
      query: (variantId) => `/variants?id=${variantId}`,
      transformResponse: (res: ApiResponse<StockResult>) => {
        if (res.error) throw new Error(res.error);
        return res.data!;
      },
      providesTags: (_result, _err, id) => [{ type: "Stock", id }],
    }),

    validateCartStock: builder.mutation<BulkStockResult[], CartItem[]>({
      query: (items) => ({
        url: "/variants",
        method: "POST",
        body: {
          items: items.map(({ variantId, quantity }) => ({
            variantId,
            quantity,
          })),
        },
      }),
      transformResponse: (res: ApiResponse<BulkStockResult[]>) => {
        if (res.error) throw new Error(res.error);
        return res.data!;
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetVariantStockQuery,
  useValidateCartStockMutation,
} = productsApi;
