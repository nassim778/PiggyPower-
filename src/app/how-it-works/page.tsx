import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How PiggyPower turns steady thermal energy into electricity and usable heat at the same time.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="label-mono">System principles</p>
      <h1 className="mt-4 font-bold text-4xl tracking-tight sm:text-5xl">
        How PiggyPower Works
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ash">
        Stop wasting the heat you already have. PiggyPower turns steady thermal
        energy into electricity and usable heat at the same time.
      </p>

      <h2 className="mt-16 font-bold text-2xl">
        Heat In. Power Out. Warmth Reused.
      </h2>
      <p className="mt-4 leading-relaxed text-ash">
        PiggyPower uses the Seebeck effect to convert a temperature difference into
        DC electrical power. A steady heat source warms one side of the cell while
        water carries heat away from the other side.
      </p>

      <ol className="mt-12 space-y-10">
        {[
          {
            t: "Add Thermal Energy",
            d: "PiggyPower Cells sit on a steady heat source such as a stove, burner, wood stove, or other hot surface. As long as heat is present, the cell has energy available to convert.",
          },
          {
            t: "Create a Temperature Difference",
            d: "Water flows across the cooling side and carries heat away. That water exits warm and can be routed to a tank, radiator, or HeatBank.",
          },
          {
            t: "Generate Electricity",
            d: "PiggyPower converts that temperature difference into DC power for small devices, charging, lighting, or battery systems — while the loop still delivers useful heat.",
          },
        ].map((s, i) => (
          <li key={s.t} className="border-t border-rule pt-6">
            <p className="font-mono text-xs text-blue">0{i + 1}</p>
            <h3 className="mt-2 font-semibold text-xl font-medium">{s.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ash">{s.d}</p>
          </li>
        ))}
      </ol>

      <Link href="/shop" className="btn-primary mt-14 inline-flex">
        Shop Systems
      </Link>
    </div>
  );
}
