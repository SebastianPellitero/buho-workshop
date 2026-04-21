"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl mx-auto mb-6">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">Order confirmed!</h1>
      <p className="text-zinc-500 mb-8">
        Thanks for your purchase. You'll receive a confirmation email shortly.
      </p>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-left mb-8 text-sm text-zinc-600 space-y-2">
        <p><span className="font-medium text-zinc-900">What's next?</span></p>
        <p>• We'll start preparing your order right away.</p>
        <p>• 3D prints take 2–4 business days to print and ship.</p>
        <p>• Montessori furniture ships within 5–7 business days.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/account">
          <Button variant="secondary" className="w-full">View order history</Button>
        </Link>
        <Link href="/">
          <Button className="w-full">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
