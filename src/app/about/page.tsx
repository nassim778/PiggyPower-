import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "PiggyPower delivers dependable electrical power where reliability matters more than peak output. Designed, built, and tested by hand in the USA.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="label-mono">About</p>
      <h1 className="mt-4 font-bold text-4xl tracking-tight sm:text-5xl">
        Built for Reliability When Everything Else Fails
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ash">
        PiggyPower delivers dependable electrical power where reliability matters
        more than peak output. Solar stops at night, wind fails when air is still,
        and batteries eventually drain. As long as steady heat exists, PiggyPower
        produces continuous electrical power day and night, without an internal
        engine, fuel tank, or weather-dependent output.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">Our Mission</h2>
      <p className="mt-2 text-lg font-medium text-ink">
        Power That Works When Conditions Don’t
      </p>
      <p className="mt-4 leading-relaxed text-ash">
        The goal of PiggyPower is simple: create power systems that prioritize
        reliability over peak output. Instead of chasing ideal environments or
        perfect weather, PiggyPower is designed for continuous operation in places
        where other power sources struggle or fail entirely.
      </p>
      <p className="mt-4 leading-relaxed text-ash">
        From emergency backup to off-grid and remote applications, PiggyPower
        focuses on steady, dependable power using solid engineering and proven
        physical principles.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-ink">
        Designed, Built, and Tested by Hand
      </h2>
      <p className="mt-4 leading-relaxed text-ash">
        PiggyPower is independently designed and built in the United States. Every
        unit is developed with a hands-on approach, prioritizing durability,
        simplicity, and long-term operation. Design decisions are driven by
        physical testing and iteration, not simulations alone or marketing targets.
      </p>
      <p className="mt-4 leading-relaxed text-ash">
        This approach allows PiggyPower to evolve through iteration, testing, and
        direct experience, resulting in hardware that is practical, rugged, and
        intentionally simple.
      </p>

      <Link href="/contact" className="btn-primary mt-10 inline-flex">
        Contact Us
      </Link>
    </div>
  );
}
