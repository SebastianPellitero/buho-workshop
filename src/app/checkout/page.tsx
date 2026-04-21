"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { useToast } from "@/components/ui/Toast";
import GuestForm from "@/components/checkout/GuestForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import Button from "@/components/ui/Button";
import type { AddressPayload } from "@/types";

export default function CheckoutPage() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<AddressPayload>({
    line1: "", line2: "", city: "", postalCode: "", country: "",
  });
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-2xl mb-2">🛒</p>
        <h1 className="text-xl font-semibold text-zinc-900 mb-2">Your cart is empty</h1>
        <p className="text-zinc-500 mb-6">Add some items before checking out.</p>
        <Link href="/">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const isValid =
    email.includes("@") &&
    address.line1.trim() &&
    address.city.trim() &&
    address.postalCode.trim() &&
    address.country.trim().length === 2;

  async function handlePlaceOrder() {
    if (!isValid) return;
    setLoading(true);
    // Simulate network delay (Stripe integration placeholder)
    await new Promise((r) => setTimeout(r, 1200));
    dispatch(clearCart());
    showToast("Order placed successfully!", "success");
    router.push("/checkout/confirmation?mock=true");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
      >
        ← Back to cart
      </Link>

      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left — delivery details */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-5">Delivery details</h2>
            <GuestForm
              email={email}
              address={address}
              onEmailChange={setEmail}
              onAddressChange={setAddress}
            />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Payment</h2>
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500 text-center">
              Stripe Elements will be mounted here
              <br />
              <span className="text-xs">Test card: 4242 4242 4242 4242</span>
            </div>
          </div>
        </div>

        {/* Right — order summary + CTA */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <OrderSummary items={items} />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500 flex justify-between">
            <span>Shipping</span>
            <span className="font-medium text-zinc-900">Free</span>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={!isValid}
            loading={loading}
            onClick={handlePlaceOrder}
          >
            Place order · €{total.toFixed(2)}
          </Button>

          {!isValid && (
            <p className="text-xs text-center text-zinc-400">
              Fill in all delivery details to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
