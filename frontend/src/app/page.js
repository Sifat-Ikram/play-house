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
import FloatingTrustBadges from "@/components/cards/FloatingTrustBadges";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--ph-bg)]">
      <Banner />

      <div className="bg-[linear-gradient(to_bottom,var(--ph-bg)_0%,var(--ph-accent-soft)_35%,var(--ph-primary-soft)_70%,var(--ph-primary-soft)_100%)]">
        <ShopByAge />
        <CategorySection />
        <ShopByInterest />
        <NewArrival />
        <ShopByOccasion />
        <FeaturedCollection />
        <BrandSection />
        <PlayHouseCTA />
        <Testimonial />
      </div>
      <FloatingTrustBadges />
    </div>
  );
}