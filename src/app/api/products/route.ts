import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, ProductSummary } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  const data: ProductSummary[] = MOCK_PRODUCTS
    .filter((p) => !category || p.categorySlug === category)
    .map(({ variants: _v, ...summary }) => summary);

  return NextResponse.json<ApiResponse<ProductSummary[]>>({ data, error: null });
}
