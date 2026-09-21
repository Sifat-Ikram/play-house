import Banner from "@/components/pages/homePage/Banner";
import ShopByAge from "@/components/pages/homePage/ShopByAge";
import BrandSection from "@/components/pages/homePage/BrandSection";
import CategorySection from "@/components/pages/homePage/CategorySection";
import NewArrival from "@/components/pages/homePage/NewArrival";
import ShopByOccasion from "@/components/pages/homePage/ShopByOccasion";
import PlayHouseCTA from "@/components/pages/homePage/PlayHouseCTA";
import ShopByInterest from "@/components/pages/homePage/ShopByInterest";
import Testimonial from "@/components/pages/homePage/Testimonial";
import FeaturedCollection from "@/components/pages/homePage/FeaturedCollection";

export default function Home() {
  return (
    <div
      className="relative min-h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--ph-bg)" }}
    >
      {/* =========================
          HERO
      ========================== */}
      <section className="relative" style={{ backgroundColor: "var(--ph-bg)" }}>
        <Banner />
      </section>

      {/* =========================
          HOME CONTENT — one flat background, no borders, no gradient.
          Section separation comes from spacing + each SectionHeader only.
      ========================== */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "var(--ph-bg)" }}>

        {/* Ambient decorative glow — kept minimal, doesn't compete with flat bg */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-[10%] h-[380px] w-[380px] rounded-full blur-3xl"
          style={{ backgroundColor: "var(--ph-primary-soft)", opacity: 0.4 }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-[55%] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ backgroundColor: "var(--ph-primary-soft)", opacity: 0.25 }}
        />

        <section className="ph-section relative">
          <ShopByAge />
        </section>

        <section className="ph-section relative">
          <CategorySection />
        </section>

        <section className="ph-section relative">
          <ShopByInterest />
        </section>

        <section className="ph-section relative">
          <NewArrival />
        </section>

        <section className="ph-section relative">
          <ShopByOccasion />
        </section>

        <section className="ph-section relative">
          <FeaturedCollection />
        </section>

        <section className="ph-section relative">
          <BrandSection />
        </section>

        <section className="ph-section relative">
          <PlayHouseCTA />
        </section>

        <section className="ph-section relative">
          <Testimonial />
        </section>
      </div>
    </div>
  );
}