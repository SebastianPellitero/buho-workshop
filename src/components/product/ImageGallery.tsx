"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const validImages = images.filter(Boolean);

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-100 text-zinc-300 text-7xl">
        ◻
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={validImages[active]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {validImages.length > 1 && (
        <div className="flex gap-2">
          {validImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                "relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all cursor-pointer",
                active === i ? "border-zinc-900" : "border-transparent hover:border-zinc-300",
              ].join(" ")}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
