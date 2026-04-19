import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, ProductSummary } from "@/types";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  try {
    const products = await prisma.product.findMany({
      where: category ? { category: { slug: category } } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        basePrice: true,
        category: { select: { slug: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const data: ProductSummary[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      images: p.images,
      basePrice: p.basePrice,
      categorySlug: p.category.slug,
    }));

    return NextResponse.json<ApiResponse<ProductSummary[]>>({
      data,
      error: null,
    });
  } catch {
    return NextResponse.json<ApiResponse<ProductSummary[]>>(
      { data: null, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
