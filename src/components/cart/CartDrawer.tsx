"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatMoney, getProductById } from "@/lib/products";
import { ProductImage } from "@/components/products/ProductImage";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem } = useCartStore();

  const lines = items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter(Boolean) as {
    product: NonNullable<ReturnType<typeof getProductById>>;
    quantity: number;
  }[];

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.priceCents * l.quantity,
    0,
  );

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-bloom shadow-xl sm:w-[min(100%,28rem)]">
        <div className="flex items-center justify-between border-b border-rule px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-5">
          <h2 className="text-lg font-bold text-ink">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center text-ash hover:text-ink"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
          {lines.length === 0 ? (
            <p className="py-12 text-center text-sm text-ash">
              Cart is empty.{" "}
              <Link href="/shop" onClick={closeCart} className="text-blue underline">
                Browse the catalog
              </Link>
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 border-b border-rule pb-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-mist">
                    <ProductImage slug={product.slug} alt={product.shortName} fill size={200} className="!p-1.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{product.shortName}</p>
                    <p className="text-sm font-semibold text-blue">{formatMoney(product.priceCents)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded border border-rule"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded border border-rule"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="ml-auto flex h-9 w-9 items-center justify-center text-ash hover:text-blue"
                        onClick={() => removeItem(product.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-rule px-4 py-4 safe-pb sm:px-5">
          <div className="mb-4 flex justify-between text-sm">
            <span className="text-ash">Subtotal</span>
            <span className="font-bold text-ink">{formatMoney(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className={`btn-primary w-full ${lines.length === 0 ? "pointer-events-none opacity-40" : ""}`}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
