"use client";

import Button from "@/components/ui/Button";
import type { AddressPayload } from "@/types";

interface SavedAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

interface AddressFillProps {
  savedAddress: SavedAddress;
  onFill: (address: AddressPayload) => void;
}

export default function AddressFill({ savedAddress, onFill }: AddressFillProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-zinc-900">Use saved address</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {savedAddress.line1}, {savedAddress.city} {savedAddress.postalCode}, {savedAddress.country}
        </p>
      </div>
      <Button variant="secondary" size="sm" onClick={() => onFill(savedAddress)}>
        Fill in
      </Button>
    </div>
  );
}
