"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import SectionHeader from "@/components/cards/SectionHeader";
import CardHome from "@/components/cards/CardHome";
import useFeaturedProducts from "@/hooks/useFeaturedProducts";

const getDiscountPercent = (original, selling) => {
  if (!original || !selling || original <= selling) return null;
  return Math.round(((original - selling) / original) * 100);
};

const FeaturedCollection = () => {
  const { featuredProducts, isLoading, isError } = useFeaturedProducts();
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);

  console.log(featuredProducts[0]);

  return (
    <section className="w-full py-6 sm:py-8 md:py-10">
      <div className="w-5/6 lg:w-11/12 mx-auto">
        {/* Section Header with Arrows */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <SectionHeader
            subtitle="Handpicked Choice"
            title="Featured Collection"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={currentIndex === 0}
              className="nav-btn"
              aria-label="Previous"
            >
              <IoIosArrowBack className="text-lg sm:text-xl" />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={currentIndex >= featuredProducts.length - slidesPerView}
              className="nav-btn"
              aria-label="Next"
            >
              <IoIosArrowForward className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setSlidesPerView(
              typeof swiper.params.slidesPerView === "number"
                ? swiper.params.slidesPerView
                : 2,
            );
          }}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          slidesPerView={2}
          spaceBetween={12}
          watchOverflow={true}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 3, spaceBetween: 14 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 18 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {featuredProducts.map((product, index) => (
            <SwiperSlide key={product.id} className="py-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/productDetails/${encodeURIComponent(product.name)}`}
                  className="block"
                >
                  <CardHome product={product} type={"featured"} />
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCollection;
