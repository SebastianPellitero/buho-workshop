import type { ProductDetail } from "@/types";

const FILAMENTS = {
  red:    { id: "fil-red",    name: "Crimson Red",    hexCode: "#DC2626", stockGrams: 800 },
  blue:   { id: "fil-blue",   name: "Ocean Blue",     hexCode: "#2563EB", stockGrams: 600 },
  green:  { id: "fil-green",  name: "Forest Green",   hexCode: "#16A34A", stockGrams: 400 },
  white:  { id: "fil-white",  name: "Pearl White",    hexCode: "#F5F5F4", stockGrams: 1000 },
};

function variants(
  productId: string,
  filamentKeys: (keyof typeof FILAMENTS)[],
  stockOverride?: Partial<Record<keyof typeof FILAMENTS, number>>
) {
  const sizes = ["S", "M", "L"] as const;
  const multipliers = { S: 1.0, M: 1.4, L: 1.8 };
  return filamentKeys.flatMap((fKey) =>
    sizes.map((size) => ({
      id: `${productId}-${fKey}-${size}`,
      size,
      priceMultiplier: multipliers[size],
      stockQty: stockOverride?.[fKey] ?? 10,
      filament: FILAMENTS[fKey],
    }))
  );
}

export const MOCK_PRODUCTS: ProductDetail[] = [
  // ── 3D Prints ──────────────────────────────────────────────────────────────
  {
    id: "prod-vase",
    name: "Geometric Vase",
    description: "A minimalist geometric vase with interlocking facets. Perfect for dried flowers or as a standalone decorative piece.",
    images: [],
    basePrice: 12,
    categorySlug: "3d-prints",
    variants: variants("prod-vase", ["red", "blue", "white"]),
  },
  {
    id: "prod-planter",
    name: "Modular Planter",
    description: "Stack multiple units to create a living wall. Each planter interlocks securely and includes drainage holes.",
    images: [],
    basePrice: 18,
    categorySlug: "3d-prints",
    variants: variants("prod-planter", ["green", "white"], { green: 2 }),
  },
  {
    id: "prod-lamp",
    name: "Lattice Lamp Shade",
    description: "A delicate lattice pattern casts beautiful shadows when lit. Fits standard E27 bulb holders.",
    images: [],
    basePrice: 28,
    categorySlug: "3d-prints",
    variants: variants("prod-lamp", ["white", "red"]),
  },

  // ── Montessori ─────────────────────────────────────────────────────────────
  {
    id: "prod-shelf",
    name: "Low Book Shelf",
    description: "A child-height open shelf designed for independent access. Encourages self-selection and tidy habits.",
    images: [],
    basePrice: 85,
    categorySlug: "montessori",
    variants: variants("prod-shelf", ["white", "green"]),
  },
  {
    id: "prod-table",
    name: "Activity Table & Stool Set",
    description: "Solid birch table with two matching stools, sized for toddlers aged 2–5. Easy to wipe clean.",
    images: [],
    basePrice: 120,
    categorySlug: "montessori",
    variants: variants("prod-table", ["white"], { white: 5 }),
  },
  {
    id: "prod-mirror",
    name: "Floor Mirror Frame",
    description: "A sturdy floor-standing mirror frame at child height. Supports movement and body awareness activities.",
    images: [],
    basePrice: 65,
    categorySlug: "montessori",
    variants: variants("prod-mirror", ["white", "blue"]),
  },
];
