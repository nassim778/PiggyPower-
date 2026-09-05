/** High-res Wix CDN images from officialpiggypower.com product catalog */
const MEDIA: Record<string, string> = {
  "the-complete-field-reference-library-all-14-manuals-3-600-pages":
    "beffe4_ff99ab6c352444f3bfdd1e421ab90b01~mv2.png",
  "piggypower-ember-blackout-kit":
    "beffe4_99c5218ac403463b94698c9f01e12102~mv2.png",
  "piggypower-single-cube-fuel-puck-press":
    "beffe4_fd6ae1699d8f44948ddc49663941e4c8~mv2.png",
  "piggypower-cell-20": "beffe4_97cc7f48da4f442a8c82c011fab90fdd~mv2.png",
  "piggypower-cell-250": "beffe4_f9feeff0cd514805b3c40bc39a1bfd33~mv2.png",
  "piggypower-survival-field-manual-printed-spiral-bound-book-digital-pdf":
    "beffe4_1688f47b1c0b4d448cf2957e5e7272d3~mv2.png",
  "support-piggypower": "beffe4_1da88181176e48fbaa402aa6154d28aa~mv2.png",
  "piggypower-cell-40": "beffe4_74f0c66cc26b437ba71c24e2404721bb~mv2.jpg",
  "piggypower-cell-125": "da7134_80da7f8da61d43488fcb9d8ae2b21057~mv2.png",
  "piggypower-ember-usb-cell-kit":
    "beffe4_edbc039cc9fc4671818c87dbe317efb2~mv2.png",
  "piggypower-heatbank-600": "beffe4_b44aba8f62cc453a8339b02482f3caef~mv2.png",
  "heatbank-1200": "beffe4_83c5fb4b37a645a1ae7afad9be75a104~mv2.png",
  "piggypower-heatbank-1800": "beffe4_dc2ce65d7b3943dfa095403c7620740c~mv2.png",
  "heatbank-2400": "beffe4_b87a11283d3b42e4a6bbe3bdd7ed93e4~mv2.jpg",
  "portable-butane-propane-camping-burner":
    "beffe4_fef0666d7abf4e8cb598be2d03d5d842~mv2.jpg",
  "stainless-steel-grilling-stand":
    "beffe4_f218940deec34dce8d376866987d8379~mv2.png",
  "emergency-thermal-bivy-sleeping-bag":
    "beffe4_75b9209e918144348f4894a4377eca6b~mv2.png",
  "compact-emergency-first-aid-kit":
    "beffe4_c5ee0e4a0e9047ca809048057774873d~mv2.jpg",
  "piggypower-blackout-led-light-strip":
    "beffe4_ee4d2e26d0914f379df091519c7fa0a0~mv2.png",
  "emergency-fiberglass-fire-blanket":
    "beffe4_9e04584d07a645f8aed838c4477b77d6~mv2.jpg",
  "5-gallon-solar-shower-gravity-water-bag":
    "beffe4_fe48cb8399d7415ba177851d65857f26~mv2.jpg",
  "piggypower-survival-field-manual-digital-pdf-only":
    "beffe4_1688f47b1c0b4d448cf2957e5e7272d3~mv2.png",
  "nuclear-war-survival-skills-oak-ridge-national-laboratory-edition-267-pages":
    "beffe4_99e3f68d1c4343b992fb33e5d5f634f4~mv2.png",
  "cold-weather-201-pages": "beffe4_afe450323d0e45938cddd8231024d287~mv2.png",
  "welding-complete-manual-778-pages":
    "beffe4_0de3a83e254c461ea38b1a346532bf87~mv2.png",
  "map-reading-land-navigation-209-pages":
    "beffe4_62494722c7bb490c9dee50d7700020e4~mv2.png",
  "first-aid-225-pages": "beffe4_e7a61cb413c74a3495f92bfe045117c9~mv2.png",
  "home-canning-complete-guide-193-pages":
    "beffe4_fbfe0db4fdd048308b12288c6843193a~mv2.png",
  "physical-fitness-u-s-army-current-edition-242-pages":
    "beffe4_7dd31b0812d14a8fa35a0b7fe9e46743~mv2.png",
  "field-hygiene-sanitation-155-pages":
    "beffe4_183849376b4c4890a04f34fe42043d10~mv2.png",
  "concrete-masonry-301-pages":
    "beffe4_ae35ff96a49a4e9e9691352dab4b2b41~mv2.png",
  "electrical-systems-237-pages":
    "beffe4_32f5b9beaa6445ec91cf2af64b60c2ab~mv2.png",
  "carpentry-222-pages": "beffe4_1cd0b87415df4c52bb5595ac84db4500~mv2.png",
  "machine-tools-311-pages": "beffe4_f21db713ef014963b74793eb4a0610c3~mv2.png",
  "power-generation-distribution-100-pages":
    "beffe4_7e0bcac8346840f68e4ea8d22ca1bb2d~mv2.png",
  "rigging-knots-168-pages": "beffe4_b0562fe0eb4248c7bfe4e61642a088b1~mv2.png",
  // TEG modules (category thumbnails)
  "piggypower-teg-10": "beffe4_67375ff842e04f1a98aa34ba4ea12d75~mv2.jpg",
  "piggypower-teg-5": "beffe4_0d378cc2dcaf40e1921b16d89f3d8d63~mv2.jpg",
};

export function wixImage(slug: string, size = 900): string | null {
  const media = MEDIA[slug];
  if (!media) return null;
  const ext = media.split(".").pop() ?? "png";
  return `https://static.wixstatic.com/media/${media}/v1/fill/w_${size},h_${size},al_c,q_90,usm_0.66_1.00_0.01/file.${ext}`;
}

export function wixHero(slug: string, w = 1600, h = 1200): string | null {
  const media = MEDIA[slug];
  if (!media) return null;
  const ext = media.split(".").pop() ?? "png";
  return `https://static.wixstatic.com/media/${media}/v1/fill/w_${w},h_${h},al_c,q_90,usm_0.66_1.00_0.01/file.${ext}`;
}

export { MEDIA };
