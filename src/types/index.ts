export type ProductCategory =
  | "generators"
  | "heatbanks"
  | "kits"
  | "accessories"
  | "manuals";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  priceCents: number;
  compareAtCents?: number;
  category: ProductCategory;
  wattage?: number;
  thermalWatts?: number;
  specs: { label: string; value: string }[];
  includes?: string[];
  featured?: boolean;
  badge?: string;
  /** Optional fallback gradient if CDN image missing */
  imageGradient?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartLine {
  product: Product;
  quantity: number;
  lineTotalCents: number;
}

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface ValidatedOrder {
  items: CartLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}
