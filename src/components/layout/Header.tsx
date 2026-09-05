"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => setMounted(true), []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Image
            src="/logo-source.png"
            alt="PiggyPower"
            width={36}
            height={36}
            className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
            priority
          />
          <span className="truncate text-base font-bold tracking-tight text-ink sm:text-lg">
            Piggy<span className="text-blue">Power</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "whitespace-nowrap text-sm transition hover:text-blue",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "font-semibold text-blue"
                  : "text-ash",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink transition hover:border-blue hover:text-blue"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue px-1 text-[11px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-rule lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={clsx(
          "fixed inset-x-0 bottom-0 top-14 z-40 bg-black/40 transition-opacity lg:hidden sm:top-16",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <div
        className={clsx(
          "fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-rule bg-white shadow-lg transition-transform duration-200 sm:top-16 sm:max-h-[calc(100dvh-4rem)] lg:hidden",
          mobileOpen ? "translate-y-0" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col px-2 py-2 safe-pb">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "rounded-lg px-4 py-3.5 text-base transition hover:bg-mist",
                pathname === item.href ? "font-semibold text-blue" : "text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/checkout"
            onClick={() => setMobileOpen(false)}
            className="mx-2 mb-2 mt-2 btn-primary"
          >
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}
