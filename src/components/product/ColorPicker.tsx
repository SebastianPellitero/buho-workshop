"use client";

import type { FilamentDTO } from "@/types";

interface ColorPickerProps {
  filaments: FilamentDTO[];
  selected: string | null;
  onChange: (filamentId: string) => void;
}

export default function ColorPicker({
  filaments,
  selected,
  onChange,
}: ColorPickerProps) {
  const available = filaments.filter((f) => f.stockGrams > 0);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-zinc-700">
        Color
        {selected && (
          <span className="ml-2 font-normal text-zinc-500">
            — {available.find((f) => f.id === selected)?.name}
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {available.map((filament) => (
          <button
            key={filament.id}
            onClick={() => onChange(filament.id)}
            title={filament.name}
            className={[
              "h-8 w-8 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 cursor-pointer",
              selected === filament.id
                ? "border-zinc-900 scale-110 shadow-md"
                : "border-transparent hover:border-zinc-400",
            ].join(" ")}
            style={{ backgroundColor: filament.hexCode }}
          />
        ))}
        {available.length === 0 && (
          <p className="text-sm text-zinc-400">No colors available</p>
        )}
      </div>
    </div>
  );
}
