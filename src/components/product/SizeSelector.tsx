"use client";

import type { Size } from "@/types";

interface SizeSelectorProps {
  sizes: Size[];
  selected: Size | null;
  onChange: (size: Size) => void;
}

const sizeLabels: Record<Size, string> = {
  S: "Small",
  M: "Medium",
  L: "Large",
};

export default function SizeSelector({
  sizes,
  selected,
  onChange,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-zinc-700">
        Size
        {selected && (
          <span className="ml-2 font-normal text-zinc-500">
            — {sizeLabels[selected]}
          </span>
        )}
      </p>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={[
              "flex h-10 w-14 items-center justify-center rounded-lg border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 cursor-pointer",
              selected === size
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500",
            ].join(" ")}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
