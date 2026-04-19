import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, ProductDetail } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { slug: true } },
        variants: {
          include: {
            filament: true,
          },
          orderBy: { size: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json<ApiResponse<ProductDetail>>(
        { data: null, error: "Product not found" },
        { status: 404 }
      );
    }

    const data: ProductDetail = {
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images,
      basePrice: product.basePrice,
      categorySlug: product.category.slug,
      variants: product.variants.map((v) => ({
        id: v.id,
        size: v.size as "S" | "M" | "L",
        priceMultiplier: v.priceMultiplier,
        stockQty: v.stockQty,
        filament: {
          id: v.filament.id,
          name: v.filament.name,
          hexCode: v.filament.hexCode,
          stockGrams: v.filament.stockGrams,
        },
      })),
    };

    return NextResponse.json<ApiResponse<ProductDetail>>({ data, error: null });
  } catch {
    return NextResponse.json<ApiResponse<ProductDetail>>(
      { data: null, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
