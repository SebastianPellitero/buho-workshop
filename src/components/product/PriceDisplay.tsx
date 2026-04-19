import { calculatePrice } from "@/lib/price";
import type { Size } from "@/types";

interface PriceDisplayProps {
  basePrice: number;
  size: Size | null;
}

export default function PriceDisplay({ basePrice, size }: PriceDisplayProps) {
  const price = size ? calculatePrice(basePrice, size) : basePrice;
  const isCalculated = size !== null;

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-zinc-900">
        €{price.toFixed(2)}
      </span>
      {!isCalculated && (
        <span className="text-sm text-zinc-500">Select a size</span>
      )}
    </div>
  );
}
