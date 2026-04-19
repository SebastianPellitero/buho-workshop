import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

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

// GET /api/variants?id=xxx  — single variant stock check
export async function GET(req: NextRequest) {
  const variantId = req.nextUrl.searchParams.get("id");

  if (!variantId) {
    return NextResponse.json<ApiResponse<StockResult>>(
      { data: null, error: "Missing variant id" },
      { status: 400 }
    );
  }

  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { stockQty: true },
    });

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
  } catch {
    return NextResponse.json<ApiResponse<StockResult>>(
      { data: null, error: "Failed to fetch stock" },
      { status: 500 }
    );
  }
}

// POST /api/variants  — bulk stock validation before checkout
// Body: { items: CartItem[] }
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      items: { variantId: string; quantity: number }[];
    };

    if (!Array.isArray(body.items)) {
      return NextResponse.json<ApiResponse<BulkStockResult[]>>(
        { data: null, error: "items must be an array" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      body.items.map(async ({ variantId, quantity }) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: variantId },
          select: { stockQty: true },
        });
        return {
          variantId,
          stockQty: variant?.stockQty ?? 0,
          available: (variant?.stockQty ?? 0) >= quantity,
          requested: quantity,
        };
      })
    );

    return NextResponse.json<ApiResponse<BulkStockResult[]>>({
      data: results,
      error: null,
    });
  } catch {
    return NextResponse.json<ApiResponse<BulkStockResult[]>>(
      { data: null, error: "Failed to validate stock" },
      { status: 500 }
    );
  }
}
