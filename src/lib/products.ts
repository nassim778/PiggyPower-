import type { Product, ProductCategory } from "@/types";

/**
 * Authoritative catalog mirrored from https://www.officialpiggypower.com/
 * Prices in cents. Client never overrides these.
 */
export const products: Product[] = [
  {
    id: "field-library",
    slug: "the-complete-field-reference-library-all-14-manuals-3-600-pages",
    name: "The Complete Field Reference Library — All 14 Emergency Manuals (3,600+ Pages)",
    shortName: "Field Reference Library",
    description:
      "All fourteen field reference manuals — over 3,600 pages — curated and delivered as digital PDFs.",
    longDescription:
      "One click, entire shelf. Every field reference manual we carry — all fourteen books, over 3,600 pages of government-grade knowledge, curated, verified, cleaned up, and delivered instantly.\n\nWhat's included: Map Reading & Land Navigation, First Aid, Field Hygiene & Sanitation, Cold Weather, Nuclear War Survival Skills, Carpentry, Concrete & Masonry, Electrical Systems, Power Generation & Distribution, Welding (778 pages on its own), Machine Tools, Rigging & Knots, Home Canning, and Physical Fitness.\n\nBought one at a time, these run $72.86. The Library gets you all fourteen for $39.99.\n\nPlease note: this bundle contains our fourteen Field Reference manuals only. The PiggyPower Survival Field Manual — the 288-page book we wrote ourselves — is a separate product and is not included in this bundle.\n\n3,600+ pages · Instant digital delivery (14 PDF files). Based on public-domain U.S. government material. Not affiliated with or endorsed by the U.S. Army, Marine Corps, USDA, or Department of Defense.",
    priceCents: 3999,
    compareAtCents: 7286,
    category: "manuals",
    featured: true,
    badge: "Bundle & Save",
    imageGradient: "from-stone-200 to-stone-400",
    specs: [
      { label: "Pages", value: "3,600+" },
      { label: "Titles", value: "14 manuals" },
      { label: "Format", value: "Digital PDF (instant)" },
    ],
  },
  {
    id: "ember-blackout",
    slug: "piggypower-ember-blackout-kit",
    name: "PiggyPower Ember Blackout Kit",
    shortName: "Ember Blackout Kit",
    description:
      "Complete blackout-ready Ember USB Cell with cooling hardware, 5-gallon reservoir bag, and USB LED light strip.",
    longDescription:
      "The PiggyPower Ember Blackout Kit is the complete blackout-ready version of the PiggyPower Ember USB Cell Kit. It includes the fully assembled Ember USB Cell, water-cooling hardware, a 5-gallon solar shower and gravity water reservoir bag, and a USB LED light strip so you can immediately put the system to use for emergency lighting and small USB-powered devices.\n\nIncludes Limited Workmanship Warranty and access to the PiggyPower Lifetime Service Rebuild Program.\n\nThe unit includes 2 USB-A ports and 1 USB-C port (up to 3 W each, up to 9 W total shared). Water cooling is required during operation.",
    priceCents: 22900,
    compareAtCents: 24900,
    category: "kits",
    featured: true,
    badge: "New Arrival",
    imageGradient: "from-neutral-200 to-neutral-500",
    specs: [
      { label: "USB Output", value: "Up to 9 W shared" },
      { label: "Ports", value: "2× USB-A + 1× USB-C" },
      { label: "Includes", value: "Reservoir bag + LED strip" },
    ],
    includes: [
      "Fully assembled PiggyPower Ember USB Cell",
      "2 USB-A ports (3W each) + 1 USB-C port (3W)",
      "Built-in voltmeter & thermometer",
      "USB-powered water pump",
      "Hose connections + 10 ft additional hose",
      "5 gallon solar shower / gravity water bag with valve",
      "Shower attachment",
      "USB LED light strip",
      "Setup and operating instructions",
    ],
  },
  {
    id: "fuel-puck-press",
    slug: "piggypower-single-cube-fuel-puck-press",
    name: "PiggyPower Single Cube Fuel Puck Press",
    shortName: "Fuel Puck Press",
    description: "Press fuel into compact cubes for controlled heat sources.",
    longDescription:
      "PiggyPower Single Cube Fuel Puck Press for making compact fuel cubes for camping burners and controlled heat sources used with PiggyPower systems.",
    priceCents: 2999,
    category: "accessories",
    featured: true,
    badge: "Emergency Fuel",
    imageGradient: "from-stone-300 to-stone-500",
    specs: [
      { label: "Type", value: "Manual single-cube press" },
    ],
  },
  {
    id: "cell-20",
    slug: "piggypower-cell-20",
    name: "PiggyPower Cell 20 – 20 W Thermoelectric Generator Kit",
    shortName: "Cell 20",
    description:
      "Compact water-cooled thermoelectric generator kit — up to 20 W from heat with recoverable warm water.",
    longDescription:
      "The PiggyPower Cell 20 is a compact, water-cooled thermoelectric generator designed to demonstrate the Seebeck effect and the direct conversion of heat into electrical power. It is intended for hands-on experimentation, off-grid projects, and educational environments where small, continuous power generation is desired.\n\nEach PiggyPower unit is built to order. Includes Limited Workmanship Warranty and access to the PiggyPower Lifetime Service Rebuild Program.\n\nWhen supplied with a controlled heat source and adequate cooling, the PiggyPower Cell 20 can generate up to 20 watts of electrical power. Rated using a cold-side cooling benchmark of 32°F (0°C) and a maximum recommended hot-side temperature of 338°F (170°C). At high-output operating conditions, raw generator output is approximately 12 to 13 V under load.\n\nThis is a solid-state thermoelectric generator with no moving parts. Designed, assembled, and tested in the USA.",
    priceCents: 34900,
    category: "generators",
    wattage: 20,
    featured: true,
    badge: "Reliable USB Power From Heat",
    imageGradient: "from-zinc-200 to-zinc-500",
    specs: [
      { label: "Peak Output", value: "Up to 20 W" },
      { label: "Raw Voltage", value: "~12–13 V under load" },
      { label: "Hot-Side Max", value: "338°F / 170°C" },
      { label: "Size / Weight", value: '4" × 4" · ~2 lb' },
      { label: "Cooling", value: "Active water loop" },
    ],
    includes: [
      "One fully assembled PiggyPower Cell 20 generator",
      "Integrated cold-side water cooling block",
      "Water pump for active cooling",
      "PiggyPower electronics conditioning board",
      "4 USB output box rated up to 40 watts",
      "Cooling hoses and fittings",
      "Extra tubing and hose clamps",
      "Water temperature thermometer",
      "User manual",
    ],
  },
  {
    id: "cell-250",
    slug: "piggypower-cell-250",
    name: "PiggyPower Cell 250 – 250 W Thermoelectric Generator Kit",
    shortName: "Cell 250",
    description:
      "Flagship 250 W water-cooled thermoelectric generator kit for continuous off-grid CHP.",
    longDescription:
      "The PiggyPower Cell 250 is the top of the PiggyPower generator line — up to 250 W of solid-state electrical output with a full water-cooling loop that recovers useful thermal energy for hot water and space heat via HeatBanks. Designed, assembled, and tested in the USA. Built to order with Limited Workmanship Warranty and Lifetime Service Rebuild Program access.",
    priceCents: 249900,
    category: "generators",
    wattage: 250,
    featured: true,
    badge: "Off-Grid Continuous Power",
    imageGradient: "from-neutral-300 to-neutral-600",
    specs: [
      { label: "Peak Output", value: "Up to 250 W" },
      { label: "System Type", value: "Combined heat & power" },
      { label: "Cooling", value: "Active water loop" },
    ],
  },
  {
    id: "field-manual-print",
    slug: "piggypower-survival-field-manual-printed-spiral-bound-book-digital-pdf",
    name: "PiggyPower Survival Field Manual - Printed Spiral Bound Book + Digital PDF",
    shortName: "Field Manual (Print + PDF)",
    description: "Printed spiral-bound PiggyPower Survival Field Manual plus digital PDF.",
    longDescription:
      "PiggyPower Survival Field Manual — printed spiral-bound book plus digital PDF access. Field-tested reference written by PiggyPower (separate from the 14-manual government reference library).",
    priceCents: 5999,
    compareAtCents: 6999,
    category: "manuals",
    featured: true,
    badge: "Field Tested",
    imageGradient: "from-stone-200 to-stone-400",
    specs: [
      { label: "Format", value: "Spiral print + PDF" },
    ],
  },
  {
    id: "support",
    slug: "support-piggypower",
    name: "Support PiggyPower",
    shortName: "Support PiggyPower",
    description:
      "A simple way to support our work and help keep making useful off-grid power projects in America. No product ships.",
    longDescription:
      "Like what we're building? This is a simple $5 way to support our work and help us keep making useful off-grid power projects here in America.\n\nNo product ships with this listing. It is just a small way to back the mission, help cover prototyping costs, and keep PiggyPower moving.\n\nThank you seriously. Every bit helps.",
    priceCents: 499,
    category: "accessories",
    featured: true,
    badge: "Help Us Build",
    imageGradient: "from-rose-100 to-rose-300",
    specs: [{ label: "Ships", value: "Nothing — donation support" }],
  },
  {
    id: "cell-40",
    slug: "piggypower-cell-40",
    name: "PiggyPower Cell 40 – 40 W Thermoelectric Generator Kit",
    shortName: "Cell 40",
    description:
      "40 W water-cooled thermoelectric generator kit for dependable device power from heat.",
    longDescription:
      "The PiggyPower Cell 40 delivers up to 40 W of solid-state thermoelectric power from a steady heat source and active water cooling. Same CHP architecture as the Cell 20 — electricity plus recoverable warm water — scaled for heavier device loads and HeatBank pairing. Built to order in the USA.",
    priceCents: 49900,
    category: "generators",
    wattage: 40,
    featured: true,
    badge: "Dependable Power For Devices",
    imageGradient: "from-zinc-200 to-zinc-500",
    specs: [
      { label: "Peak Output", value: "Up to 40 W" },
      { label: "Architecture", value: "Water-cooled TEG" },
      { label: "Build", value: "USA, built to order" },
    ],
  },
  {
    id: "teg-10",
    slug: "piggypower-teg-10",
    name: "PiggyPower TEG 10",
    shortName: "TEG 10",
    description: "PiggyPower TEG 10 unit with handle and wires — thermoelectric module for builds and experimentation.",
    longDescription:
      "PiggyPower TEG 10 thermoelectric generator module with handle and wires. Intended for experimentation and energy conversion projects. See product page on officialpiggypower.com for full operating guidance.",
    priceCents: 7900,
    category: "generators",
    wattage: 10,
    featured: true,
    badge: "New Arrival",
    imageGradient: "from-stone-200 to-stone-500",
    specs: [
      { label: "Type", value: "TEG module" },
      { label: "Class", value: "TEG 10" },
    ],
  },
  {
    id: "teg-5",
    slug: "piggypower-teg-5",
    name: "PiggyPower TEG 5",
    shortName: "TEG 5",
    description: "PiggyPower TEG 5 thermoelectric module for smaller experiments and builds.",
    longDescription:
      "PiggyPower TEG 5 thermoelectric generator module for experimentation and energy conversion projects.",
    priceCents: 4900,
    category: "generators",
    wattage: 5,
    badge: "New Arrival",
    imageGradient: "from-stone-200 to-stone-400",
    specs: [
      { label: "Type", value: "TEG module" },
      { label: "Class", value: "TEG 5" },
    ],
  },
  {
    id: "cell-125",
    slug: "piggypower-cell-125",
    name: "PiggyPower Cell 125 – 125 W Thermoelectric Generator Kit",
    shortName: "Cell 125",
    description:
      "125 W thermoelectric generator kit — ideal for battery systems and higher CHP loads.",
    longDescription:
      "The Cell 125 is built for serious off-grid and emergency CHP setups. Generate up to 125 W while routing warm coolant into HeatBanks, storage tanks, or space-heat loops. Designed, assembled, and tested in the USA.",
    priceCents: 124900,
    category: "generators",
    wattage: 125,
    featured: true,
    badge: "Ideal for Battery Systems",
    imageGradient: "from-neutral-300 to-neutral-600",
    specs: [
      { label: "Peak Output", value: "Up to 125 W" },
      { label: "System Type", value: "Combined heat & power" },
    ],
  },
  {
    id: "ember-usb",
    slug: "piggypower-ember-usb-cell-kit",
    name: "PiggyPower Ember USB Cell Kit",
    shortName: "Ember USB Cell Kit",
    description:
      "Compact water-cooled kit that turns controlled heat into usable USB power for lighting and devices.",
    longDescription:
      "The PiggyPower Ember USB Cell Kit is a compact, water-cooled thermoelectric generator kit designed to turn controlled heat into usable USB power. It is built for emergency lighting, battery bank charging, camping, blackout preparedness, off-grid testing, and real heat-to-electricity demonstrations.\n\nIncludes 2 USB-A ports and 1 USB-C port (up to 3 W each, up to 9 W total shared). Built-in voltmeter. Water cooling is required. Includes Limited Workmanship Warranty and Lifetime Service Rebuild Program access.",
    priceCents: 19900,
    category: "kits",
    featured: true,
    badge: "New Arrival",
    imageGradient: "from-neutral-200 to-neutral-500",
    specs: [
      { label: "USB Output", value: "Up to 9 W shared" },
      { label: "Ports", value: "2× USB-A + 1× USB-C" },
    ],
    includes: [
      "Fully assembled PiggyPower Ember USB Cell",
      "2 USB-A (3W) + 1 USB-C (3W)",
      "Built-in voltmeter & thermometer",
      "USB water pump",
      "Hose kit + 10 ft hose",
      "Setup instructions",
    ],
  },
  {
    id: "heatbank-600",
    slug: "piggypower-heatbank-600",
    name: "PiggyPower HeatBank 600",
    shortName: "HeatBank 600",
    description:
      "Hydronic fan heater up to 600 thermal watts (~2,000 BTU/hr). Turns loop hot water into room heat.",
    longDescription:
      "Hydronic Fan Heater, Up to 600 Thermal Watts, About 2,000 BTU/hr.\n\nThis is a heating accessory only. It does not generate electricity by itself. The HeatBank 600 gives hot water from your PiggyPower loop a second purpose by running it through a small radiator and blowing the heat into the room as warm air.\n\nBest paired with PiggyPower Ember and the 20 W PiggyPower Cell. Fan is USB-powered (~1.08 W at 12 V) via included 5 V to 12 V step-up adapter.",
    priceCents: 14900,
    category: "heatbanks",
    thermalWatts: 600,
    featured: true,
    badge: "Space Heating",
    imageGradient: "from-slate-200 to-slate-400",
    specs: [
      { label: "Thermal Class", value: "Up to 600 W (~2,000 BTU/hr)" },
      { label: "Fan", value: "~1.08 W @ 12 V (USB)" },
      { label: "Best With", value: "Ember / Cell 20" },
    ],
  },
  {
    id: "heatbank-1200",
    slug: "heatbank-1200",
    name: "PiggyPower HeatBank 1200",
    shortName: "HeatBank 1200",
    description: "Hydronic fan heater — 1200 W thermal class for cabins and mid-size CHP loops.",
    longDescription:
      "PiggyPower HeatBank 1200 — USB-powered hydronic fan heater that pulls energy from hot water and releases it as room heat. Compare thermal classes for off-grid heating, blackouts, and thermoelectric CHP systems.",
    priceCents: 24900,
    category: "heatbanks",
    thermalWatts: 1200,
    featured: true,
    badge: "New Arrival",
    imageGradient: "from-slate-200 to-slate-500",
    specs: [
      { label: "Thermal Class", value: "1200 W" },
      { label: "Drive", value: "USB-powered fans" },
    ],
  },
  {
    id: "heatbank-1800",
    slug: "piggypower-heatbank-1800",
    name: "PiggyPower HeatBank 1800",
    shortName: "HeatBank 1800",
    description: "Hydronic fan heater — 1800 W thermal class for larger spaces.",
    longDescription:
      "PiggyPower HeatBank 1800 — USB-powered hydronic fan heater for higher heat-rejection CHP systems and larger rooms.",
    priceCents: 32900,
    category: "heatbanks",
    thermalWatts: 1800,
    featured: true,
    badge: "New Arrival",
    imageGradient: "from-slate-300 to-slate-500",
    specs: [
      { label: "Thermal Class", value: "1800 W" },
      { label: "Drive", value: "USB-powered fans" },
    ],
  },
  {
    id: "heatbank-2400",
    slug: "heatbank-2400",
    name: "PiggyPower HeatBank 2400",
    shortName: "HeatBank 2400",
    description: "Top thermal class hydronic fan heater — 2400 W for maximum space-heat recovery.",
    longDescription:
      "PiggyPower HeatBank 2400 — highest thermal class in the line for extracting and distributing warmth from high-output PiggyPower CHP loops.",
    priceCents: 39900,
    category: "heatbanks",
    thermalWatts: 2400,
    featured: true,
    badge: "New Arrival",
    imageGradient: "from-slate-300 to-slate-600",
    specs: [
      { label: "Thermal Class", value: "2400 W" },
      { label: "Drive", value: "USB-powered fans" },
    ],
  },
  {
    id: "camping-burner",
    slug: "portable-butane-propane-camping-burner",
    name: "Portable Butane Propane Camping Burner",
    shortName: "Camping Burner",
    description:
      "3500W folding camping gas stove — compact heat source for Ember, Cell 20, and Cell 40.",
    longDescription:
      "Compact, lightweight, and easy to pack, this 3500W folding camping gas stove is built for backpacking, hiking, camping, picnics, emergency cooking, and other outdoor use. Foldable one-piece design with plastic storage box.\n\nWeight: 115g. Fuel: propane, butane, or isobutane mixtures. Built-in ignition. Stainless steel, aluminum, and copper components. Gas canister not included.\n\nBest suited for Ember, Cell 20, and Cell 40. Can be used with Cell 125 with a separate stable stand. Not ideal for Cell 250 full rated output. Always use a solid intermediary surface — never direct flame on the generator block.",
    priceCents: 2999,
    category: "accessories",
    imageGradient: "from-orange-100 to-stone-400",
    specs: [
      { label: "Weight", value: "115g" },
      { label: "Fuel", value: "Propane / butane / isobutane" },
      { label: "Ignition", value: "Built-in" },
    ],
  },
  {
    id: "grilling-stand",
    slug: "stainless-steel-grilling-stand",
    name: "Stainless Steel Grilling Stand",
    shortName: "Grilling Stand",
    description:
      "304 stainless camp grill / stand — recommended for Cell 40, Cell 20, and Ember setups.",
    longDescription:
      "Compact stainless steel grill for camping, outdoor cooking, blackout setups, and small off-grid use. Can be used as a suitable stand for the Cell 40, Cell 20, and the Ember unit. Made from 304 stainless steel. This is the same stand used in many PiggyPower videos.",
    priceCents: 1699,
    category: "accessories",
    imageGradient: "from-zinc-200 to-zinc-400",
    specs: [{ label: "Material", value: "304 stainless steel" }],
  },
  {
    id: "thermal-bivy",
    slug: "emergency-thermal-bivy-sleeping-bag",
    name: "Emergency Thermal Bivy Sleeping Bag",
    shortName: "Thermal Bivy",
    description: "Reflective emergency bivy for blackout and field preparedness kits.",
    longDescription:
      "Emergency Thermal Bivy Sleeping Bag for blackout kits, camping, and emergency shelter.",
    priceCents: 1999,
    category: "accessories",
    imageGradient: "from-slate-200 to-slate-400",
    specs: [{ label: "Type", value: "Emergency shelter" }],
  },
  {
    id: "first-aid",
    slug: "compact-emergency-first-aid-kit",
    name: "Emergency First Aid Kit",
    shortName: "First Aid Kit",
    description: "Compact first-aid kit for homestead, cabin, and blackout readiness.",
    longDescription: "Compact Emergency First Aid Kit for off-grid and emergency kits.",
    priceCents: 2499,
    category: "accessories",
    imageGradient: "from-red-100 to-stone-300",
    specs: [{ label: "Type", value: "Emergency medical" }],
  },
  {
    id: "led-strip",
    slug: "piggypower-blackout-led-light-strip",
    name: "Replacement Blackout LED Light Strip",
    shortName: "LED Light Strip",
    description: "Replacement USB LED strip for Ember Blackout and emergency lighting.",
    longDescription:
      "Replacement Blackout LED Light Strip for PiggyPower Ember Blackout Kit and emergency lighting setups.",
    priceCents: 1099,
    category: "accessories",
    imageGradient: "from-yellow-100 to-stone-300",
    specs: [{ label: "Type", value: "Replacement LED" }],
  },
  {
    id: "fire-blanket",
    slug: "emergency-fiberglass-fire-blanket",
    name: "Emergency Fiberglass Fire Blanket",
    shortName: "Fire Blanket",
    description: "Fiberglass fire blanket for stove, burner, and workshop safety.",
    longDescription:
      "Emergency Fiberglass Fire Blanket — keep near any heat-source thermoelectric setup.",
    priceCents: 1499,
    category: "accessories",
    imageGradient: "from-red-100 to-neutral-400",
    specs: [{ label: "Material", value: "Fiberglass" }],
  },
  {
    id: "solar-shower",
    slug: "5-gallon-solar-shower-gravity-water-bag",
    name: "Replacement 5 Gallon Solar Shower & Gravity Water Bag",
    shortName: "5 Gal Water Bag",
    description: "Gravity water bag for cooling loops, showers, and field water staging.",
    longDescription:
      "Replacement 5 Gallon Solar Shower & Gravity Water Bag — useful as a cooling reservoir or warm-water staging tank.",
    priceCents: 999,
    category: "accessories",
    imageGradient: "from-sky-100 to-stone-300",
    specs: [{ label: "Capacity", value: "5 gallons" }],
  },
  {
    id: "field-manual-pdf",
    slug: "piggypower-survival-field-manual-digital-pdf-only",
    name: "PiggyPower Survival Field Manual - Digital PDF Only",
    shortName: "Field Manual (PDF)",
    description: "Digital-only PiggyPower Survival Field Manual.",
    longDescription: "Digital PDF edition of the PiggyPower Survival Field Manual.",
    priceCents: 2999,
    compareAtCents: 3499,
    category: "manuals",
    badge: "Sale",
    imageGradient: "from-stone-200 to-stone-400",
    specs: [{ label: "Format", value: "PDF download" }],
  },
  // Individual manuals ($4.99 / $7.99) — slugs match live site
  manual("manual-nuclear", "nuclear-war-survival-skills-oak-ridge-national-laboratory-edition-267-pages", "Nuclear War Survival Skills — Oak Ridge National Laboratory Edition (267 Pages)", "Nuclear Survival", 499, "267"),
  manual("manual-cold", "cold-weather-201-pages", "Cold Weather — (201 Pages)", "Cold Weather", 499, "201"),
  manual("manual-welding", "welding-complete-manual-778-pages", "Welding — Complete Manual (778 Pages)", "Welding", 799, "778"),
  manual("manual-land-nav", "map-reading-land-navigation-209-pages", "Map Reading & Land Navigation — (209 Pages)", "Land Navigation", 499, "209"),
  manual("manual-first-aid", "first-aid-225-pages", "First Aid — (225 Pages)", "First Aid", 499, "225"),
  manual("manual-canning", "home-canning-complete-guide-193-pages", "Home Canning — Complete Guide (193 Pages)", "Home Canning", 499, "193"),
  manual("manual-fitness", "physical-fitness-u-s-army-current-edition-242-pages", "Physical Fitness — U.S. Army, Current Edition (242 Pages)", "Physical Fitness", 499, "242"),
  manual("manual-hygiene", "field-hygiene-sanitation-155-pages", "Field Hygiene & Sanitation — (155 Pages)", "Field Hygiene", 499, "155"),
  manual("manual-concrete", "concrete-masonry-301-pages", "Concrete & Masonry — (301 Pages)", "Concrete & Masonry", 499, "301"),
  manual("manual-electrical", "electrical-systems-237-pages", "Electrical Systems — (237 Pages)", "Electrical Systems", 499, "237"),
  manual("manual-carpentry", "carpentry-222-pages", "Carpentry — (222 Pages)", "Carpentry", 499, "222"),
  manual("manual-machine-tools", "machine-tools-311-pages", "Machine Tools — (311 Pages)", "Machine Tools", 499, "311"),
  manual("manual-power-gen", "power-generation-distribution-100-pages", "Power Generation & Distribution — (100 Pages)", "Power Generation", 499, "100"),
  manual("manual-rigging", "rigging-knots-168-pages", "Rigging & Knots — (168 Pages)", "Rigging & Knots", 499, "168"),
];

function manual(
  id: string,
  slug: string,
  name: string,
  shortName: string,
  priceCents: number,
  pages: string,
): Product {
  return {
    id,
    slug,
    name,
    shortName,
    description: `${name} — digital field reference PDF.`,
    longDescription: `${name}\n\nDigital field reference based on public-domain U.S. government material. Instant PDF delivery. Not affiliated with or endorsed by the U.S. Army, Marine Corps, USDA, or Department of Defense.`,
    priceCents,
    category: "manuals",
    imageGradient: "from-stone-100 to-stone-300",
    specs: [
      { label: "Pages", value: pages },
      { label: "Format", value: "Digital PDF" },
    ],
  };
}

export const categoryLabels: Record<ProductCategory, string> = {
  generators: "Thermoelectric Generators",
  heatbanks: "HeatBanks",
  kits: "Ember Kits",
  accessories: "Accessories",
  manuals: "Emergency Books & Guides",
};

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
