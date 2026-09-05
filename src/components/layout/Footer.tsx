import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-rule bg-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Image src="/logo-source.png" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="font-bold text-ink">
              Piggy<span className="text-blue">Power</span>
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ash">
            Electricity, hot water, and space heat from the same energy source.
            Designed, assembled, and tested in the USA.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Shop</h3>
          <ul className="space-y-2 text-sm text-ash">
            <li><Link href="/shop?category=generators" className="hover:text-blue">Generators</Link></li>
            <li><Link href="/shop?category=heatbanks" className="hover:text-blue">HeatBanks</Link></li>
            <li><Link href="/shop?category=kits" className="hover:text-blue">Ember Kits</Link></li>
            <li><Link href="/shop?category=manuals" className="hover:text-blue">Books & Guides</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Info</h3>
          <ul className="space-y-2 text-sm text-ash">
            <li><Link href="/how-it-works" className="hover:text-blue">How It Works</Link></li>
            <li><Link href="/shipping" className="hover:text-blue">Shipping Policy</Link></li>
            <li><Link href="/faq" className="hover:text-blue">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-blue">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule px-4 py-4 text-center text-xs text-ash safe-pb">
        ™ {new Date().getFullYear()} PiggyPower
      </div>
    </footer>
  );
}
