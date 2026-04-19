"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import CartDrawer from "./CartDrawer";

export default function CartBadge() {
  const [open, setOpen] = useState(false);
  const count = useAppSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
        aria-label={`Cart (${count} items)`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-white text-[10px] font-bold">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
