"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <label className="flex items-center gap-2 text-sm text-ash">
        Quantity
        <input
          type="number"
          min={1}
          max={99}
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
          className="h-11 w-16 rounded border border-rule px-2 text-center text-ink outline-none focus:border-blue"
        />
      </label>
      <button
        type="button"
        onClick={() => addItem(product.id, qty)}
        className="btn-primary w-full sm:w-auto sm:min-w-[180px]"
      >
        Add to Cart
      </button>
    </div>
  );
}
