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
    <div className="min-h-screen">
      <Banner />

      <div className="bg-[linear-gradient(to_bottom,#ffffff_0%,#f0f9ff_35%,#fffbeb_70%,#FFDE59_100%)]">
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

      {/* Review Section with the testimonial background */}
      <div className="bg-[#5b95ff]">
        {/* <ReviewSection /> */}
      </div>
    </div>
  );
}
