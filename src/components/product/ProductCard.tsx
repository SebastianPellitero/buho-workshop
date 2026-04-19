import Link from "next/link";
import Image from "next/image";
import type { ProductSummary } from "@/types";

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/${product.categorySlug}/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square bg-zinc-100 overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300 text-5xl">
            ◻
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-500 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-sm font-semibold text-zinc-900">
          From €{product.basePrice.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
