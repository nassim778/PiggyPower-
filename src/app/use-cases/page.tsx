import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "PiggyPower provides continuous electrical power anywhere steady heat is available — emergency backup, off-grid, waste heat recovery, and field use.",
};

const cases = [
  {
    title: "Emergency Backup Power",
    body: "Reliable electricity during outages, storms, and grid failures when power matters most.",
  },
  {
    title: "Off-Grid & Remote Power",
    body: "Continuous power for cabins, remote sites, and off-grid locations without relying on sunlight or fuel deliveries.",
  },
  {
    title: "Industrial Waste Heat Recovery",
    body: "Convert unused industrial heat into usable electrical power for monitoring, sensors, or auxiliary systems.",
  },
  {
    title: "Critical Infrastructure & Field Use",
    body: "Dependable power for critical systems where maintenance, refueling, or downtime is not an option.",
  },
];

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-bold text-ink">Power Where Other Systems Fail</h1>
      <p className="mt-4 text-lg text-ash leading-relaxed">
        PiggyPower provides continuous electrical power anywhere steady heat is
        available, regardless of weather, sunlight, or grid access.
      </p>
      <h2 className="mt-12 text-2xl font-bold text-ink">Power That Doesn’t Quit</h2>
      <p className="mt-3 text-ash leading-relaxed">
        Each use case below represents environments where traditional power sources
        struggle due to weather, remoteness, fuel logistics, or maintenance
        constraints. PiggyPower delivers continuous electrical power anywhere
        steady heat is available, without an internal engine, fuel tank, or
        dependence on ideal weather conditions.
      </p>
      <div className="mt-10 space-y-8">
        {cases.map((c) => (
          <div key={c.title} className="border-l-4 border-blue pl-5">
            <h3 className="text-xl font-semibold text-ink">{c.title}</h3>
            <p className="mt-2 text-ash">{c.body}</p>
          </div>
        ))}
      </div>
      <Link href="/shop" className="btn-primary mt-12 inline-flex">
        Shop Systems
      </Link>
    </div>
  );
}
