"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useGetProductQuery } from "@/store/api/productsApi";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { calculatePrice } from "@/lib/price";
import { useToast } from "@/components/ui/Toast";
import ColorPicker from "@/components/product/ColorPicker";
import SizeSelector from "@/components/product/SizeSelector";
import PriceDisplay from "@/components/product/PriceDisplay";
import ImageGallery from "@/components/product/ImageGallery";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import type { Size } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const category = params.category as string;

  const { data: product, isLoading, isError } = useGetProductQuery(productId);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [selectedFilamentId, setSelectedFilamentId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  const filaments = useMemo(() => {
    if (!product) return [];
    const seen = new Map<string, (typeof product.variants)[0]["filament"]>();
    for (const v of product.variants) {
      if (!seen.has(v.filament.id)) seen.set(v.filament.id, v.filament);
    }
    return Array.from(seen.values());
  }, [product]);

  const availableSizes = useMemo((): Size[] => {
    if (!product || !selectedFilamentId) return [];
    return product.variants
      .filter((v) => v.filament.id === selectedFilamentId && v.stockQty > 0)
      .map((v) => v.size);
  }, [product, selectedFilamentId]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedFilamentId || !selectedSize) return null;
    return product.variants.find(
      (v) => v.filament.id === selectedFilamentId && v.size === selectedSize
    ) ?? null;
  }, [product, selectedFilamentId, selectedSize]);

  function handleAddToCart() {
    if (!product || !selectedVariant || !selectedFilamentId) return;
    const filament = filaments.find((f) => f.id === selectedFilamentId)!;
    const price = calculatePrice(product.basePrice, selectedVariant.size);

    dispatch(
      addItem({
        variantId: selectedVariant.id,
        productName: product.name,
        color: filament.name,
        size: selectedVariant.size,
        price,
        quantity: 1,
        image: product.images[0] ?? "",
      })
    );
    showToast(`${product.name} added to cart`, "success");
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !product) {
    return notFound();
  }

  const canAddToCart = selectedVariant !== null && selectedVariant.stockQty > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href={`/${category}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
      >
        ← Back to {category === "3d-prints" ? "3D Prints" : "Montessori"}
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <ImageGallery images={product.images} alt={product.name} />

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-zinc-500 mb-1 capitalize">
              {category.replace("-", " ")}
            </p>
            <h1 className="text-3xl font-bold text-zinc-900">{product.name}</h1>
            <p className="mt-3 text-zinc-600 leading-relaxed">{product.description}</p>
          </div>

          <PriceDisplay basePrice={product.basePrice} size={selectedSize} />

          <div className="flex flex-col gap-5">
            <ColorPicker
              filaments={filaments}
              selected={selectedFilamentId}
              onChange={(id) => {
                setSelectedFilamentId(id);
                setSelectedSize(null);
              }}
            />

            {selectedFilamentId && (
              <SizeSelector
                sizes={availableSizes}
                selected={selectedSize}
                onChange={setSelectedSize}
              />
            )}
          </div>

          {selectedVariant && selectedVariant.stockQty <= 3 && (
            <p className="text-sm text-amber-600">
              Only {selectedVariant.stockQty} left in stock
            </p>
          )}

          <Button
            size="lg"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
            className="w-full"
          >
            {!selectedFilamentId
              ? "Select a color"
              : !selectedSize
              ? "Select a size"
              : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
