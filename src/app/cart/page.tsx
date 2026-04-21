"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/checkout/OrderSummary";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const items = useAppSelector((s) => s.cart.items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-4xl mb-4">🛒</p>
        <h1 className="text-xl font-semibold text-zinc-900 mb-2">Your cart is empty</h1>
        <p className="text-zinc-500 mb-6">Browse our products and add something you like.</p>
        <Link href="/"><Button>Browse products</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Your cart</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white px-4">
          {items.map((item) => (
            <CartItemRow key={item.variantId} item={item} />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <OrderSummary items={items} />
          </div>
          <Link href="/checkout">
            <Button size="lg" className="w-full">Proceed to checkout</Button>
          </Link>
          <Link href="/" className="text-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
