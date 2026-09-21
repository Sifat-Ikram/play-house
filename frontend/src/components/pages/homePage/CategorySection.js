"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";

import useCategory from "@/hooks/useCategory";
import SectionHeader from "@/components/cards/SectionHeader";

const CategorySection = () => {
    const swiperRef = useRef(null);
    const { categories, isLoading, isError } = useCategory();

    /* ---------------- Loading ---------------- */
    if (isLoading) {
        return (
            <section className="ph-section !py-6 sm:!py-8">
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
                                className="h-[145px] w-[108px] shrink-0 animate-pulse rounded-xl sm:h-[170px] sm:w-[135px] md:h-[185px] md:w-[150px]"
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
                <p className="body-sm">Unable to load categories.</p>
            </section>
        );
    }

    /* ---------------- Empty ---------------- */
    if (!categories?.length) return null;

    /* ---------------- Main Section ---------------- */
    return (
        <section className="ph-section !py-6 sm:!py-8">
            <div className="ph-container">
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                    <SectionHeader subtitle="Shop By" title="Categories" />

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="nav-btn"
                            aria-label="Previous category"
                        >
                            <IoIosArrowBack className="text-lg sm:text-xl md:text-2xl" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => swiperRef.current?.slideNext()}
                            className="nav-btn"
                            aria-label="Next category"
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
                    slidesPerView={3}
                    spaceBetween={10}
                    watchOverflow={true}
                    breakpoints={{
                        0: { slidesPerView: 2.6, spaceBetween: 10 },
                        420: { slidesPerView: 3.2, spaceBetween: 12 },
                        640: { slidesPerView: 4, spaceBetween: 14 },
                        768: { slidesPerView: 5.8, spaceBetween: 14 },
                        1024: { slidesPerView: 5.5, spaceBetween: 15 },
                        1280: { slidesPerView: 6.5, spaceBetween: 15 },
                        1536: { slidesPerView: 9.5, spaceBetween: 60 },
                    }}
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={category.category_id}>
                            <Link href={`/categoryDetail/${category.category_id}`} className="group block">
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.04 }}
                                    whileHover={{ y: -4 }}
                                    className="mx-auto flex h-[145px] w-[108px] flex-col items-center justify-start sm:h-[170px] sm:w-[135px] md:h-[185px] md:w-[150px]"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full transition-shadow duration-300 sm:h-20 sm:w-20 md:h-24 md:w-24"
                                        style={{
                                            backgroundColor: "var(--ph-surface)",
                                            border: "1px solid var(--ph-border)",
                                            boxShadow: "0 4px 14px -6px rgba(15,23,42,0.12)",
                                        }}
                                    >
                                        <Image
                                            src={category?.category_image || "/placeholder.png"}
                                            alt={category?.category_name || "Category"}
                                            fill
                                            sizes="(max-width: 640px) 64px, 96px"
                                            className="rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </motion.div>

                                    {/* Title: full-width of the tile, 2-line clamp, no side padding starving it */}
                                    <h3
                                        className="mt-2 line-clamp-2 w-full break-words px-0.5 text-center text-[10.5px] font-semibold leading-tight sm:mt-2.5 sm:text-[12px] md:text-[13px]"
                                        style={{ color: "var(--ph-text-soft)" }}
                                        title={category?.category_name}
                                    >
                                        {category?.category_name}
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

export default CategorySection;