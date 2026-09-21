"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";

import useBrand from "@/hooks/useBrand";
import SectionHeader from "@/components/cards/SectionHeader";

const BrandSection = () => {
    const swiperRef = useRef(null);
    const { brands, isLoading, isError } = useBrand();

    /* ---------------- Loading ---------------- */
    if (isLoading) {
        return (
            <section className="!py-6 sm:!py-8">
                <div className="ph-container">
                    <div className="mb-4 flex items-center justify-between sm:mb-6">
                        <div
                            className="h-5 w-28 animate-pulse rounded sm:h-7 sm:w-36"
                            style={{ backgroundColor: "var(--ph-border)" }}
                        />
                        <div
                            className="h-8 w-20 animate-pulse rounded-full"
                            style={{ backgroundColor: "var(--ph-border)" }}
                        />
                    </div>

                    <div className="flex gap-3 overflow-hidden sm:gap-4">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="h-[130px] w-[100px] shrink-0 animate-pulse rounded-xl sm:h-[155px] sm:w-[125px] md:h-[170px] md:w-[140px]"
                                style={{ backgroundColor: "var(--ph-border)" }}
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
            <section className="py-6 text-center">
                <p className="body-sm">Unable to load brands.</p>
            </section>
        );
    }

    /* ---------------- Empty ---------------- */
    if (!brands?.length) return null;

    /* ---------------- Main Section ---------------- */
    return (
        <section className="!py-6 sm:!py-8">
            <div className="ph-container">
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                    <SectionHeader subtitle="Explore" title="Our Top Brands" />
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

                <Swiper
                    modules={[Autoplay]}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    loop={true}
                    autoplay={{ delay: 2200, disableOnInteraction: false, pauseOnMouseEnter: true }}
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
                            <Link href={`/brandDetail/${brand.brand_id}`} className="group block">
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.04 }}
                                    whileHover={{ y: -4 }}
                                    className="mx-auto flex h-[130px] w-[100px] flex-col items-center justify-center sm:h-[155px] sm:w-[125px] md:h-[170px] md:w-[140px]"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full transition-shadow duration-300 sm:h-20 sm:w-20 md:h-24 md:w-24"
                                        style={{
                                            backgroundColor: "var(--ph-surface)",
                                            border: "1px solid var(--ph-border)",
                                            boxShadow: "0 4px 14px -6px rgba(15,23,42,0.12)",
                                        }}
                                    >
                                        <img
                                            src={brand.brand_image || ""}
                                            alt={`${brand.brand_name || "Brand"} Logo`}
                                            className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </motion.div>

                                    <h3
                                        className="mt-2 w-[85px] overflow-hidden text-center text-[10px] font-semibold leading-tight sm:mt-2.5 sm:w-[105px] sm:text-xs md:w-[115px] md:text-sm"
                                        style={{ color: "var(--ph-text-soft)" }}
                                    >
                                        {brand.brand_name}
                                    </h3>
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