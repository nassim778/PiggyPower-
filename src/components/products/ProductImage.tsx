"use client";

import Image from "next/image";
import { wixImage } from "@/lib/product-images";
import clsx from "clsx";

export function ProductImage({
  slug,
  alt,
  size = 900,
  className,
  priority = false,
  fill = false,
}: {
  slug: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  const src = wixImage(slug, size);

  if (!src) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center bg-mist text-ash",
          className,
        )}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          No image
        </span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={clsx("object-contain p-4", className)}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={clsx("h-auto w-full object-contain", className)}
      priority={priority}
    />
  );
}
