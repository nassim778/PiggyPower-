"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { formatMoney } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { ProductImage } from "@/components/products/ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-rule bg-bloom transition hover:border-rule hover:shadow-sm dark:hover:shadow-none">
      <Link href={`/shop/${product.slug}`} className="relative aspect-square bg-mist">
        <ProductImage
          slug={product.slug}
          alt={product.name}
          fill
          size={800}
          className="!p-4 transition duration-300 group-hover:scale-[1.03] sm:!p-5"
        />
        {product.badge && (
          <span className="absolute left-2 top-2 max-w-[85%] truncate rounded bg-blue px-2 py-1 text-[10px] font-semibold text-white sm:left-3 sm:top-3 sm:text-[11px]">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-ink group-hover:text-blue">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-xs text-ash sm:text-sm">
          {product.description}
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div>
            <p className="text-base font-bold text-ink sm:text-lg">
              {formatMoney(product.priceCents)}
            </p>
            {product.compareAtCents && (
              <p className="text-xs text-ash line-through sm:text-sm">
                {formatMoney(product.compareAtCents)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => addItem(product.id)}
            className="btn-secondary w-full sm:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
