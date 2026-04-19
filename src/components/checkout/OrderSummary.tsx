import Image from "next/image";
import type { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-900">Order Summary</h2>

      <div className="divide-y divide-zinc-100">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3 py-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              {item.image ? (
                <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="56px" />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-300 text-xl">◻</div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center gap-0.5 min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">{item.productName}</p>
              <p className="text-xs text-zinc-500">{item.color} · {item.size} · Qty {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-zinc-900 self-center">
              €{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 pt-3 flex justify-between">
        <span className="font-semibold text-zinc-900">Total</span>
        <span className="font-bold text-zinc-900">€{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
