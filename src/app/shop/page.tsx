import type { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { categoryLabels, products } from "@/lib/products";
import type { ProductCategory } from "@/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop PiggyPower thermoelectric generators, HeatBanks, Ember kits, accessories, and field manuals.",
};

const categories: Array<ProductCategory | "all"> = [
  "all",
  "generators",
  "heatbanks",
  "kits",
  "accessories",
  "manuals",
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = (params.category as ProductCategory | "all") || "all";
  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold text-ink sm:text-4xl">Shop</h1>
      <p className="mt-2 text-sm text-ash sm:text-base">
        We ship worldwide — please contact us first for shipping outside of the USA.
      </p>
      <p className="mt-1 text-sm text-ash">{filtered.length} products</p>

      <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:mt-8 sm:overflow-visible sm:px-0">
        <div className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
          {categories.map((cat) => {
            const href = cat === "all" ? "/shop" : `/shop?category=${cat}`;
            const active = category === cat;
            const label = cat === "all" ? "All Products" : categoryLabels[cat];
            return (
              <a
                key={cat}
                href={href}
                className={
                  active
                    ? "shrink-0 rounded-full bg-blue px-4 py-2.5 text-sm font-medium text-white"
                    : "shrink-0 rounded-full border border-rule px-4 py-2.5 text-sm text-ash hover:border-blue hover:text-blue"
                }
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
