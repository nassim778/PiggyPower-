import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "FAQ about PiggyPower thermoelectric generators, cooling, output, and how they compare to solar.",
};

const faqs: { q: string; a: string }[] = [
  {
    q: "Is PiggyPower just a Peltier?",
    a: "NO! This is the most common misconception we get. PiggyPower is not a cheap cooling chip flipped upside down and sold as a generator. PiggyPower is a purpose built thermoelectric power cell designed to turn heat into usable electricity. Cheap Peltier projects WILL fail because they are not built for serious heat, proper clamping, stable cooling, long term durability, or real electrical output. PiggyPower is built as a complete system with heat spreading, water cooling, compression, wiring, output electronics, and real world testing.",
  },
  {
    q: "Why is PiggyPower so expensive?",
    a: "Because you are buying a finished, ready to go out of the box, assembled, water cooled, tested power cell, not a loose science project part. The cost comes from the custom generator technology, aluminum heat spreaders, water block cooling, hardware, wiring, electronics, labor, testing, and quality control. Cheap online parts may look similar to people who do not understand the system, but they are not the same product.",
  },
  {
    q: "Does PiggyPower create free energy?",
    a: "No. PiggyPower converts heat into electricity. It needs a heat source and a cooler side. The value is that heat is already everywhere — fire, charcoal, propane, wood stoves, camp stoves, and waste heat. PiggyPower captures part of that heat as electricity.",
  },
  {
    q: "How does PiggyPower work?",
    a: "PiggyPower works from a temperature difference. One side gets hot and the other side is kept cooler, usually with water cooling. That temperature difference creates electrical output. More stable heat and better cooling generally means better performance.",
  },
  {
    q: "Why does it need water cooling?",
    a: "Cooling is half the system. If the cold side gets hot, output drops. Water is very good at carrying heat away, which helps maintain the temperature difference needed to produce useful power.",
  },
  {
    q: "Does the water get hot?",
    a: "Yes. The water is removing heat from the cold side, so it will warm up over time. That heat can still be useful. In a full heat recovery setup, the same heat that helps produce electricity can also contribute to hot water or space heating.",
  },
  {
    q: "Will it power my whole house?",
    a: "No. PiggyPower is not sold as a whole house power plant. It is made for emergency power, off grid support, battery charging, lighting, communications, and waste heat recovery. Think phones, battery banks, LED lights, routers, radios, small USB devices, and emergency electronics.",
  },
  {
    q: "How much power does it make?",
    a: "Output depends on the model, heat source, cold side temperature, water flow, and load. PiggyPower cells are sold by output class, such as 20 W, 40 W, 125 W, and 250 W. The rating means the cell is built for that class of output under proper thermal conditions.",
  },
  {
    q: "Why not just get a solar panel?",
    a: "Solar panels are great when you have sun, space, good weather, and enough time to charge. PiggyPower solves a different problem. It makes power from heat, which means it can work at night, during storms, in winter, around camp, during outages, and anywhere a usable heat source is available. PiggyPower and solar can work well together.",
  },
  {
    q: "Is PiggyPower supposed to replace solar?",
    a: "No. PiggyPower and solar can actually work well together. Solar is strongest during good daylight. PiggyPower is strongest when heat is available. For emergency use, having more than one way to make power is a major advantage.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="label-mono">Support</p>
      <h1 className="mt-4 font-bold text-4xl tracking-tight sm:text-5xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-4 text-ash">
        This list is long — use your browser&apos;s find feature if needed. If you
        do not find your question here, please{" "}
        <a href="/contact" className="text-blue underline">
          contact us
        </a>
        .
      </p>
      <div className="mt-10 space-y-8">
        {faqs.map((item) => (
          <div key={item.q} className="border-b border-rule pb-8">
            <h2 className="text-lg font-semibold text-ink">Q. {item.q}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ash">A. {item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
