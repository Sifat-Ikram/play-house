"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";

import useNewArrival from "@/hooks/useNewArrival";
import CardHome from "@/components/cards/CardHome";
import SectionHeader from "@/components/cards/SectionHeader";

const NewArrival = () => {
    const swiperRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(2);

    const {
        newArrivals,
        isLoading,
        isError,
    } = useNewArrival();

    /* ---------------- Loading ---------------- */

    if (isLoading) {
        return (
            <section className="w-full py-6 sm:py-8 md:py-10">
                <div className="w-5/6 lg:w-11/12 mx-auto flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-28 sm:w-36 h-5 sm:h-7 bg-[var(--ph-border)] rounded-full animate-pulse" />
                    <div className="w-20 h-8 bg-[var(--ph-border)] rounded-full animate-pulse" />
                </div>

                <div className="w-5/6 lg:w-11/12 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="overflow-hidden rounded-tl-2xl rounded-tr-3xl rounded-bl-3xl rounded-br-2xl border border-[var(--ph-border)] bg-[var(--ph-surface)] shadow-sm"
                        >
                            <div className="w-full h-[120px] sm:h-[160px] md:h-[180px] lg:h-[210px] bg-[var(--ph-border)] animate-pulse" />
                            <div className="p-3 space-y-2">
                                <div className="w-1/3 h-3 bg-[var(--ph-border)] rounded animate-pulse" />
                                <div className="w-4/5 h-4 bg-[var(--ph-border)] rounded animate-pulse" />
                                <div className="w-1/3 h-4 bg-[var(--ph-border)] rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    /* ---------------- Error ---------------- */

    if (isError) {
        return (
            <section className="w-full py-10 text-center">
                <p className="text-[var(--ph-text-faint)]" style={{ fontFamily: "var(--font-body)" }}>
                    Unable to load new arrivals.
                </p>
            </section>
        );
    }

    /* ---------------- Empty ---------------- */

    if (!newArrivals?.length) {
        return (
            <section className="w-full py-10">
                <p
                    className="text-center text-lg font-normal text-[var(--ph-text-faint)]"
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    No new arrivals at the moment.
                </p>
            </section>
        );
    }

    /* ---------------- Main Section ---------------- */

    return (
        <section className="w-full py-6 sm:py-8 md:py-10">
            <div className="w-5/6 lg:w-11/12 mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <SectionHeader
                        subtitle="Just Arrived"
                        title="New Arrivals"
                    />

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => swiperRef.current?.slidePrev()}
                            disabled={currentIndex === 0}
                            className="nav-btn"
                            aria-label="Previous products"
                        >
                            <IoIosArrowBack className="text-lg sm:text-xl md:text-2xl" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => swiperRef.current?.slideNext()}
                            disabled={currentIndex >= newArrivals.length - slidesPerView}
                            className="nav-btn"
                            aria-label="Next products"
                        >
                            <IoIosArrowForward className="text-lg sm:text-xl md:text-2xl" />
                        </motion.button>
                    </div>
                </div>

                {/* Carousel */}
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setSlidesPerView(
                            typeof swiper.params.slidesPerView === "number"
                                ? swiper.params.slidesPerView
                                : 2
                        );
                    }}
                    onSlideChange={(swiper) => {
                        setCurrentIndex(swiper.activeIndex);
                    }}
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
                    {newArrivals.map((featured, index) => (
                        <SwiperSlide
                            key={featured.id}
                            className="py-2"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                }}
                            >
                                <Link
                                    href={`/productDetail/${featured.id}`}
                                    className="block"
                                >
                                    <CardHome product={featured} badge="NEW" />
                                </Link>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default NewArrival;