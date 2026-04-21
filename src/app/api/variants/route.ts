import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mockData";

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

function findVariant(variantId: string) {
  for (const p of MOCK_PRODUCTS) {
    const v = p.variants.find((v) => v.id === variantId);
    if (v) return v;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const variantId = req.nextUrl.searchParams.get("id");

  if (!variantId) {
    return NextResponse.json<ApiResponse<StockResult>>(
      { data: null, error: "Missing variant id" },
      { status: 400 }
    );
  }

  const variant = findVariant(variantId);

  if (!variant) {
    return NextResponse.json<ApiResponse<StockResult>>(
      { data: null, error: "Variant not found" },
      { status: 404 }
    );
  }

  return NextResponse.json<ApiResponse<StockResult>>({
    data: { variantId, stockQty: variant.stockQty },
    error: null,
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    items: { variantId: string; quantity: number }[];
  };

  if (!Array.isArray(body.items)) {
    return NextResponse.json<ApiResponse<BulkStockResult[]>>(
      { data: null, error: "items must be an array" },
      { status: 400 }
    );
  }

  const data: BulkStockResult[] = body.items.map(({ variantId, quantity }) => {
    const variant = findVariant(variantId);
    return {
      variantId,
      stockQty: variant?.stockQty ?? 0,
      available: (variant?.stockQty ?? 0) >= quantity,
      requested: quantity,
    };
  });

  return NextResponse.json<ApiResponse<BulkStockResult[]>>({ data, error: null });
}
