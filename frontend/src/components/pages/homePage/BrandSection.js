"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";

import useBrand from "@/hooks/useBrand";

const BrandSection = () => {
    const swiperRef = useRef(null);
    const { brands, isLoading, isError } = useBrand();

    if (isLoading) {
        return (
            <section className="w-5/6 lg:w-11/12 mx-auto py-8 sm:py-10 md:py-12">
                <h2 className="text-center text-lg md:text-2xl lg:text-4xl font-bold font-poppins mb-8">
                    Our Top Brands
                </h2>

                <div className="flex justify-center gap-6 sm:gap-10 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="flex flex-col items-center min-w-[90px] sm:min-w-[120px]"
                        >
                            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gray-200 animate-pulse" />

                            <div className="w-14 sm:w-20 h-3 bg-gray-200 rounded mt-3 animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="w-5/6 lg:w-11/12 mx-auto py-8 text-center">
                <p className="text-gray-500 font-roboto">
                    Unable to load brands.
                </p>
            </section>
        );
    }

    if (!brands?.length) {
        return null;
    }

    return (
        <section className="w-5/6 lg:w-11/12 mx-auto py-8 sm:py-10 md:py-12">

            {/* =========================
          SECTION HEADER
      ========================== */}
            <div className="text-center mb-7 sm:mb-9 md:mb-11">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 font-roboto tracking-[0.15em] uppercase mb-1 sm:mb-2">
                        Explore
                    </p>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-poppins text-gray-900">
                        Our Top Brands
                    </h2>

                    <div className="w-12 sm:w-16 h-[3px] bg-[#FEF987] mx-auto mt-3 rounded-full" />
                </motion.div>
            </div>


            {/* =========================
          CAROUSEL
      ========================== */}
            <div className="relative px-1 sm:px-3 md:px-5">

                {/* Previous Button */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="
            absolute
            left-[-25px] sm:left-[-32px] md:left-[-40px] lg:left-[-48px]
            top-1/2
            -translate-y-1/2
            z-20
            w-8 h-8
            sm:w-10 sm:h-10
            md:w-11 md:h-11
            flex items-center justify-center
            rounded-full
            bg-[#FEF987]
            shadow-md
            hover:shadow-lg
            transition-shadow
            duration-200
          "
                    aria-label="Previous brands"
                >
                    <IoIosArrowBack className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800" />
                </motion.button>


                {/* Next Button */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => swiperRef.current?.slideNext()}
                    className="
            absolute
            right-[-25px] sm:right-[-32px] md:right-[-40px] lg:right-[-48px]
            top-1/2
            -translate-y-1/2
            z-20
            w-8 h-8
            sm:w-10 sm:h-10
            md:w-11 md:h-11
            flex items-center justify-center
            rounded-full
            bg-[#FEF987]
            shadow-md
            hover:shadow-lg
            transition-shadow
            duration-200
          "
                    aria-label="Next brands"
                >
                    <IoIosArrowForward className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800" />
                </motion.button>


                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerView={2.2}
                    spaceBetween={12}
                    centeredSlides={true}
                    watchOverflow={true}
                    breakpoints={{
                        // Mobile
                        0: {
                            slidesPerView: 2.2,
                            spaceBetween: 10,
                        },

                        // Larger mobile
                        480: {
                            slidesPerView: 2.8,
                            spaceBetween: 12,
                        },

                        // Tablet
                        640: {
                            slidesPerView: 3.5,
                            spaceBetween: 15,
                        },

                        768: {
                            slidesPerView: 4,
                            spaceBetween: 18,
                        },

                        // Small desktop
                        1024: {
                            slidesPerView: 4.5,
                            spaceBetween: 20,
                        },

                        // Desktop
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 22,
                        },

                        // Large desktop
                        1536: {
                            slidesPerView: 5.5,
                            spaceBetween: 25,
                        },
                    }}
                >
                    {brands.map((brand, index) => (
                        <SwiperSlide key={brand.brand_id}>
                            {({ isActive }) => (
                                <Link
                                    href={`/brandDetail/${brand.brand_id}`}
                                    className="block"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.05,
                                        }}
                                        className="flex flex-col items-center justify-center py-2 sm:py-3"
                                    >
                                        {/* Brand Logo */}
                                        <motion.div
                                            animate={{
                                                scale: isActive ? 1 : 0.9,
                                            }}
                                            whileHover={{
                                                scale: 1.08,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                            }}
                                            className="
                        relative
                        w-16 h-16
                        sm:w-20 sm:h-20
                        md:w-24 md:h-24
                        lg:w-28 lg:h-28
                        xl:w-32 xl:h-32
                        rounded-full
                        overflow-hidden
                        bg-white
                        border border-gray-100
                        shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                        flex items-center justify-center
                      "
                                        >
                                            <img
                                                src={brand.brand_image || ""}
                                                alt={`${brand.brand_name || "Brand"} Logo`}
                                                className="
                          w-full
                          h-full
                          rounded-full
                          object-cover
                          transition-transform
                          duration-300
                        "
                                                loading="lazy"
                                            />

                                            {/* Hover overlay */}
                                            <div className="
                        absolute
                        inset-0
                        rounded-full
                        bg-black/0
                        group-hover:bg-black/5
                        transition-colors
                        duration-300
                      " />
                                        </motion.div>


                                        {/* Brand Name */}
                                        <motion.h3
                                            whileHover={{ y: -2 }}
                                            className="
                        text-center
                        font-roboto
                        font-bold
                        text-xs
                        sm:text-sm
                        md:text-base
                        lg:text-lg
                        text-gray-800
                        mt-2
                        sm:mt-3
                        line-clamp-1
                        max-w-[100px]
                        sm:max-w-[130px]
                        md:max-w-[160px]
                      "
                                        >
                                            {brand.brand_name}
                                        </motion.h3>
                                    </motion.div>
                                </Link>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BrandSection;