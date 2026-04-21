"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useGetProductsQuery } from "@/store/api/productsApi";
import ProductCard from "@/components/product/ProductCard";
import Spinner from "@/components/ui/Spinner";

const VALID_CATEGORIES = ["3d-prints", "montessori"];

const CATEGORY_LABELS: Record<string, { name: string; description: string }> = {
  "3d-prints": {
    name: "3D Prints",
    description: "Custom objects printed in high-quality PLA filament. Pick your color and size.",
  },
  montessori: {
    name: "Montessori Furniture",
    description: "Thoughtfully designed furniture for early childhood learning environments.",
  },
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  if (!VALID_CATEGORIES.includes(category)) notFound();

  const { data: products, isLoading, isError } = useGetProductsQuery(category);
  const meta = CATEGORY_LABELS[category];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">{meta.name}</h1>
        <p className="mt-2 text-zinc-500">{meta.description}</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          Failed to load products. Please try again.
        </div>
      )}

      {products && products.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center text-zinc-400">
          No products found in this category yet.
        </div>
      )}

      {products && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
