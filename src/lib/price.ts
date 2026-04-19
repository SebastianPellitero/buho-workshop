const SIZE_MULTIPLIERS: Record<string, number> = {
  S: 1.0,
  M: 1.4,
  L: 1.8,
};

export function calculatePrice(basePrice: number, size: string): number {
  const multiplier = SIZE_MULTIPLIERS[size] ?? 1.0;
  return Math.round(basePrice * multiplier * 100) / 100;
}
