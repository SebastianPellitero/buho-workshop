"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { OrderDTO } from "@/types";

// Mock order history — replace with useGetOrdersQuery when auth is wired up
const MOCK_ORDERS: OrderDTO[] = [
  {
    id: "ord-001",
    status: "PAID",
    total: 33.60,
    email: "demo@example.com",
    address: { line1: "123 Main St", city: "Amsterdam", postalCode: "1011 AB", country: "NL" },
    items: [
      { id: "oi-1", variantId: "prod-vase-red-M", quantity: 2, priceAtPurchase: 16.80 },
    ],
    createdAt: "2026-04-15T10:30:00Z",
  },
  {
    id: "ord-002",
    status: "PAID",
    total: 85.00,
    email: "demo@example.com",
    address: { line1: "123 Main St", city: "Amsterdam", postalCode: "1011 AB", country: "NL" },
    items: [
      { id: "oi-2", variantId: "prod-shelf-white-L", quantity: 1, priceAtPurchase: 85.00 },
    ],
    createdAt: "2026-04-10T14:00:00Z",
  },
];

const statusColor: Record<string, "success" | "error" | "warning" | "default"> = {
  PAID: "success",
  PENDING: "warning",
  FAILED: "error",
  CANCELLED: "default",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">My Account</h1>
        <Link href="/">
          <Button variant="ghost" size="sm">← Shop</Button>
        </Link>
      </div>

      {/* Saved address */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-3">Saved address</h2>
        <div className="text-sm text-zinc-600 space-y-0.5">
          <p>123 Main Street</p>
          <p>Amsterdam, 1011 AB</p>
          <p>Netherlands</p>
        </div>
      </div>

      {/* Order history */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Order history</h2>

        {MOCK_ORDERS.length === 0 ? (
          <div className="py-12 text-center text-zinc-400">
            <p>No orders yet.</p>
            <Link href="/" className="mt-3 inline-block">
              <Button size="sm">Start shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">#{order.id}</span>
                    <Badge variant={statusColor[order.status]}>{order.status}</Badge>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString("en-NL", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                    {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-sm font-bold text-zinc-900 shrink-0">
                  €{order.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
