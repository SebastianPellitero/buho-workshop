import { prisma } from "./prisma";
import type { CartItem } from "@/types";

export interface StockConflict {
  variantId: string;
  productName: string;
  requested: number;
  available: number;
}

export async function validateCartStock(
  items: CartItem[]
): Promise<StockConflict[]> {
  const conflicts: StockConflict[] = [];

  await Promise.all(
    items.map(async (item) => {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        select: { stockQty: true },
      });

      if (!variant || variant.stockQty < item.quantity) {
        conflicts.push({
          variantId: item.variantId,
          productName: item.productName,
          requested: item.quantity,
          available: variant?.stockQty ?? 0,
        });
      }
    })
  );

  return conflicts;
}
