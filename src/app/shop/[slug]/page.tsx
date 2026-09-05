import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductImage } from "@/components/products/ProductImage";
import { categoryLabels, formatMoney, getProductBySlug, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist ring-1 ring-rule">
          <ProductImage
            slug={product.slug}
            alt={product.name}
            fill
            size={1100}
            priority
            className="!p-5 sm:!p-8"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-blue">{categoryLabels[product.category]}</p>
          {product.badge && (
            <span className="mt-2 inline-block rounded bg-blue px-2 py-1 text-[11px] font-semibold text-white">
              {product.badge}
            </span>
          )}
          <h1 className="mt-3 text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-bold text-blue sm:text-3xl">
              {formatMoney(product.priceCents)}
            </span>
            {product.compareAtCents && (
              <span className="text-base text-ash line-through sm:text-lg">
                {formatMoney(product.compareAtCents)}
              </span>
            )}
          </div>

          <div className="mt-6 space-y-4 whitespace-pre-line text-sm leading-relaxed text-ash">
            {product.longDescription}
          </div>

          <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-rule bg-paper/95 px-4 py-3 backdrop-blur safe-pb sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-rule sm:mt-10">
            <h2 className="border-b border-rule bg-mist px-4 py-3 text-sm font-semibold text-ink">
              Specifications
            </h2>
            <dl>
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-1 border-b border-rule px-4 py-3 text-sm last:border-0 sm:flex-row sm:justify-between sm:gap-4"
                >
                  <dt className="text-ash">{spec.label}</dt>
                  <dd className="font-medium text-ink sm:text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {product.includes && product.includes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-ink">What&apos;s included</h2>
              <ul className="mt-3 space-y-2 text-sm text-ash">
                {product.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="shrink-0 text-blue">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
