"use client";

import Link from "next/link";
import CartBadge from "@/components/cart/CartBadge";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 hover:text-zinc-600 transition-colors"
        >
          Buho Workshop
        </Link>

        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/3d-prints" className="hover:text-zinc-900 transition-colors">
            3D Prints
          </Link>
          <Link href="/montessori" className="hover:text-zinc-900 transition-colors">
            Montessori
          </Link>
          <Link href="/account" className="hover:text-zinc-900 transition-colors">
            Account
          </Link>
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}
