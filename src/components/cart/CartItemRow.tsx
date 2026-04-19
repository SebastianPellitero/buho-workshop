"use client";

import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { removeItem, updateQuantity } from "@/store/slices/cartSlice";
import type { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-3 py-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        {item.image ? (
          <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300 text-2xl">◻</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">{item.productName}</p>
        <p className="text-xs text-zinc-500">
          {item.color} · {item.size}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                dispatch(updateQuantity({ variantId: item.variantId, quantity: item.quantity - 1 }))
              }
              className="flex h-6 w-6 items-center justify-center rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer text-xs"
            >
              −
            </button>
            <span className="w-4 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() =>
                dispatch(updateQuantity({ variantId: item.variantId, quantity: item.quantity + 1 }))
              }
              className="flex h-6 w-6 items-center justify-center rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer text-xs"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-900">
              €{(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => dispatch(removeItem(item.variantId))}
              className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Remove item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
