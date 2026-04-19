"use client";

import type { AddressPayload } from "@/types";

interface GuestFormProps {
  email: string;
  address: AddressPayload;
  onEmailChange: (v: string) => void;
  onAddressChange: (v: AddressPayload) => void;
}

export default function GuestForm({
  email,
  address,
  onEmailChange,
  onAddressChange,
}: GuestFormProps) {
  const field = (
    label: string,
    value: string,
    key: keyof AddressPayload,
    placeholder?: string
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onAddressChange({ ...address, [key]: e.target.value })}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">Email</label>
        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => onEmailChange(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      {field("Address", address.line1, "line1", "123 Main Street")}
      {field("Apartment, suite, etc. (optional)", address.line2 ?? "", "line2", "Apt 4B")}

      <div className="grid grid-cols-2 gap-3">
        {field("City", address.city, "city", "Amsterdam")}
        {field("Postal Code", address.postalCode, "postalCode", "1011 AB")}
      </div>

      {field("Country (2-letter code)", address.country, "country", "NL")}
    </div>
  );
}
