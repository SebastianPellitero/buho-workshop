import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, ProductDetail } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json<ApiResponse<ProductDetail>>(
      { data: null, error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json<ApiResponse<ProductDetail>>({ data: product, error: null });
}
