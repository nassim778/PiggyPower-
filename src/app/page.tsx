import {
  Explainer,
  FeaturedGrid,
  Hero,
  Spotlight,
  UseCasesHome,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGrid />
      <Spotlight />
      <Explainer />
      <UseCasesHome />
    </>
  );
}
