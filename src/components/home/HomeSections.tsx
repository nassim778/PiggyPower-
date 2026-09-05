import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, getProductBySlug, formatMoney } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { wixHero, wixImage } from "@/lib/product-images";

export function Hero() {
  const heroSrc =
    wixHero("piggypower-ember-blackout-kit", 1400, 1100) ||
    wixImage("piggypower-cell-20", 1000);

  return (
    <section className="relative overflow-hidden bg-mist">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(30,99,182,0.18),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:py-20">
        <div className="animate-rise order-2 lg:order-1">
          <h1 className="text-[1.85rem] font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-5xl">
            Power Your Devices.
            <br />
            Warm Your Water.
            <br />
            <span className="text-blue">Heat Your Space.</span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ash sm:mt-6 sm:text-lg">
            PiggyPower systems use one heat source to make electricity for your
            devices while also warming water that can be used for space heat or
            hot water.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link href="/how-it-works" className="btn-primary w-full sm:w-auto">
              Learn More
            </Link>
            <Link href="/shop" className="btn-ghost w-full sm:w-auto">
              Shop
            </Link>
          </div>
        </div>

        <div className="animate-rise-2 relative order-1 mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-bloom shadow-sm ring-1 ring-rule sm:aspect-square sm:max-w-md lg:order-2 lg:max-w-none">
          {heroSrc && (
            <Image
              src={heroSrc}
              alt="PiggyPower thermoelectric kit"
              fill
              priority
              className="object-contain p-4 sm:p-6"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 45vw"
            />
          )}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-blue/10" />
        </div>
      </div>
    </section>
  );
}

export function FeaturedGrid() {
  const featured = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-2xl font-bold text-ink sm:text-3xl">Featured Items</h2>
      <p className="mt-2 max-w-2xl text-sm text-ash sm:text-base">
        Electricity, hot water, and space heat from the same energy source.
        Designed, assembled, and tested in the USA.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-10 text-center sm:mt-12">
        <Link href="/shop" className="btn-primary w-full sm:w-auto">
          Shop
        </Link>
      </div>
    </section>
  );
}

export function Spotlight() {
  const cell = getProductBySlug("piggypower-cell-20");
  const img = wixImage("piggypower-cell-20", 900);
  if (!cell || !img) return null;

  return (
    <section className="bg-mist">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-12 sm:gap-8 sm:px-6 sm:py-16 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-bloom ring-1 ring-rule lg:max-w-none">
          <Image
            src={img}
            alt={cell.name}
            fill
            className="object-contain p-6 sm:p-10"
            sizes="(max-width: 1024px) 90vw, 50vw"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue sm:text-sm">
            Reliable USB Power From Heat
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{cell.shortName}</h2>
          <p className="mt-2 text-xl font-semibold text-blue sm:text-2xl">
            {formatMoney(cell.priceCents)}
          </p>
          <p className="mt-4 text-sm text-ash leading-relaxed sm:text-base">{cell.description}</p>
          <Link href={`/shop/${cell.slug}`} className="btn-primary mt-6 inline-flex w-full sm:mt-8 sm:w-auto">
            View Product
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Explainer() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-5 text-[15px] leading-relaxed text-ash sm:text-base">
        <p>
          Our devices run on heat you probably already have. Simply apply heat to
          one side with something like a wood stove, gas stove, propane burner,
          camp stove, campfire setup, candle, Sterno, or hot plate. Run water
          through the other side with the included pump, gravity, or a natural
          thermosiphon. The heat on one side and the cooler water on the other
          side create electricity for lights, power banks, phones, radios, small
          fans, sensors, and emergency gear. While the system makes power, the
          water also warms up because it is carrying heat away from the device.
        </p>
        <p>
          That warm water can go through a PiggyPower HeatBank to help heat a
          room, or into a separate tank for warm water use like washing or
          showering. With the right HeatBank sizing, the system can reach
          equilibrium and provide electricity, space heating, and hot water at
          the same time. That is CHP. One heat source making electricity and
          useful heat at the same time.
        </p>
      </div>
    </section>
  );
}

export function UseCasesHome() {
  const cases = [
    {
      title: "Emergency Backup",
      body: "When the grid goes down, PiggyPower gives you another way to make electricity from heat. Use it for phones, lighting, small devices, battery charging, or emergency loads while the same loop delivers usable heat for comfort, hot water, storage, or space heating.",
    },
    {
      title: "Cabins and Remote Sites",
      body: "For cabins, sheds, camps, and remote sites, PiggyPower gives you backup power when sunlight is weak, batteries are low, or fuel needs to do more.",
    },
    {
      title: "Education & Experimentation",
      body: "Test real hardware instead of just watching theory videos. PiggyPower gives makers, students, and builders a hands on way to explore thermoelectrics and small CHP setups.",
    },
  ];

  return (
    <section className="border-t border-rule bg-bloom">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">How People Use PiggyPower</h2>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
          {cases.map((c) => (
            <div key={c.title} className="rounded-xl border border-rule bg-mist/50 p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-ink sm:text-xl">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ash">{c.body}</p>
            </div>
          ))}
        </div>
        <Link href="/use-cases" className="mt-8 inline-block text-sm font-semibold text-blue hover:underline">
          Learn more about use cases →
        </Link>
      </div>
    </section>
  );
}
