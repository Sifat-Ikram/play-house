import Banner from "@/components/pages/homePage/Banner";
import ShopByAge from "@/components/pages/homePage/ShopByAge";
import BrandSection from "@/components/pages/homePage/BrandSection";
import CategorySection from "@/components/pages/homePage/CategorySection";
import NewArrival from "@/components/pages/homePage/NewArrival";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Banner />

      {/* Wrapper for middle sections with a smooth color transition */}
      <div className="">
        <ShopByAge />
        <BrandSection />
        <NewArrival />
        <CategorySection />
        {/* Place remaining middle sections here */}
      </div>

      {/* Review Section with the testimonial background */}
      <div className="bg-[#5b95ff]">
        {/* <ReviewSection /> */}
      </div>
    </div>
  );
}



// bg-gradient-to-b from-white via-[#e8f0fe] to-[#5b95ff]