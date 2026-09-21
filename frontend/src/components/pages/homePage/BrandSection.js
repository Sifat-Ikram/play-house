"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import {
    IoIosArrowBack,
    IoIosArrowForward,
} from "react-icons/io";

import "swiper/css";

import useBrand from "@/hooks/useBrand";
import SectionHeader from "@/components/cards/SectionHeader";

const BrandSection = () => {
    const swiperRef = useRef(null);

    const {
        brands,
        isLoading,
        isError,
    } = useBrand();

    /* ---------------- Loading ---------------- */

    if (isLoading) {
        return (
            <section className="bg-[#FFFCEA] py-6 sm:py-8 md:py-10">
                <div className="w-5/6 lg:w-11/12 mx-auto">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse" />
                        <div className="w-28 sm:w-36 h-5 sm:h-7 bg-gray-200 rounded animate-pulse" />
                    </div>

                    <div className="flex gap-3 sm:gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="w-[100px] h-[130px] sm:w-[125px] sm:h-[155px] md:w-[140px] md:h-[170px] rounded-xl bg-gray-200 animate-pulse shrink-0"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    /* ---------------- Error ---------------- */

    if (isError) {
        return (
            <section className="bg-[#FFFCEA] py-6 text-center">
                <p className="text-gray-500 font-roboto">
                    Unable to load brands.
                </p>
            </section>
        );
    }

    /* ---------------- Empty ---------------- */

    if (!brands?.length) {
        return null;
    }

    /* ---------------- Main Section ---------------- */

    return (
        <section className="py-6 sm:py-8 md:py-10">
            <div className="w-5/6 lg:w-11/12 mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <SectionHeader
                        subtitle="Explore"
                        title="Our Top Brands"
                    />
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="nav-btn"
                            aria-label="Previous brand"
                        >
                            <IoIosArrowBack className="text-lg sm:text-xl md:text-2xl" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => swiperRef.current?.slideNext()}
                            className="nav-btn"
                            aria-label="Next brand"
                        >
                            <IoIosArrowForward className="text-lg sm:text-xl md:text-2xl" />
                        </motion.button>
                    </div>
                </div>

                {/* Carousel */}
                <Swiper
                    modules={[Autoplay]}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    loop={true}
                    autoplay={{
                        delay: 2200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    slidesPerView={3.2}
                    spaceBetween={10}
                    watchOverflow={true}
                    breakpoints={{
                        0: { slidesPerView: 3.2, spaceBetween: 8 },
                        420: { slidesPerView: 3.8, spaceBetween: 10 },
                        640: { slidesPerView: 4.5, spaceBetween: 12 },
                        768: { slidesPerView: 5.5, spaceBetween: 14 },
                        1024: { slidesPerView: 6, spaceBetween: 16 },
                        1280: { slidesPerView: 7, spaceBetween: 16 },
                        1536: { slidesPerView: 8, spaceBetween: 18 },
                    }}
                >
                    {brands.map((brand, index) => (
                        <SwiperSlide key={brand.brand_id}>
                            <Link
                                href={`/brandDetail/${brand.brand_id}`}
                                className="block group"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.04,
                                    }}
                                    whileHover={{ y: -4 }}
                                    className="flex flex-col items-center justify-center
        w-[100px] h-[130px]
        sm:w-[125px] sm:h-[155px]
        md:w-[140px] md:h-[170px]
        mx-auto"
                                >
                                    {/* Brand Logo */}
                                    <motion.div
                                        whileHover={{
                                            scale: 1.08,
                                            rotate: [0, -5, 5, -2, 0],
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white border border-gray-100 shadow-[0_4px_14px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_22px_rgba(0,0,0,0.15)] transition-shadow duration-300 flex items-center justify-center shrink-0"
                                    >
                                        <img
                                            src={brand.brand_image || ""}
                                            alt={`${brand.brand_name || "Brand"} Logo`}
                                            className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </motion.div>

                                    {/* Brand Name */}
                                    <motion.h3
                                        whileHover={{ y: -1 }}
                                        className="text-center font-roboto font-semibold text-[10px] sm:text-xs md:text-sm text-gray-800 mt-2 sm:mt-2.5 line-clamp-1 leading-tight w-[85px] sm:w-[105px] md:w-[115px] overflow-hidden"
                                    >
                                        {brand.brand_name}
                                    </motion.h3>
                                </motion.div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BrandSection;