"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";

import useNewArrival from "@/hooks/useNewArrival";
import CardHome from "@/components/cards/CardHome";

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
            <section className="w-full py-10 sm:py-14 md:py-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8 sm:mb-10 md:mb-12"
                >
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 font-roboto tracking-[0.15em] uppercase mb-1 sm:mb-2">
                        Just Arrived
                    </p>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-poppins text-gray-900">
                        New Arrivals
                    </h2>

                    <div className="w-12 sm:w-16 h-[3px] bg-[#FEF987] mx-auto mt-3 rounded-full" />
                </motion.div>

                {/* Skeleton Cards */}
                <div className="w-5/6 lg:w-11/12 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="w-full h-[110px] sm:h-[150px] md:h-[170px] lg:h-[200px] bg-gray-200 animate-pulse" />

                            <div className="p-2 sm:p-3 md:p-4 space-y-2">
                                <div className="w-1/3 h-3 bg-gray-200 rounded animate-pulse" />
                                <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse" />
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
            <section className="w-full py-10 sm:py-14 md:py-20 text-center">
                <p className="text-gray-500 font-roboto">
                    Unable to load new arrivals.
                </p>
            </section>
        );
    }

    /* ---------------- Empty ---------------- */

    if (!newArrivals?.length) {
        return (
            <section className="w-full py-10 sm:py-14 md:py-20">
                <p className="text-center font-roboto text-lg font-normal text-gray-500">
                    No new arrivals at the moment.
                </p>
            </section>
        );
    }

    /* ---------------- Main Section ---------------- */

    return (
        <section className="w-full py-10 sm:py-14 md:py-20 bg-[#f5f5f5]">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8 sm:mb-10 md:mb-12"
            >
                <p className="text-xs sm:text-sm md:text-base text-gray-500 font-roboto tracking-[0.15em] uppercase mb-1 sm:mb-2">
                    Just Arrived
                </p>

                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-poppins text-gray-900">
                    New Arrivals
                </h2>

                <div className="w-12 sm:w-16 h-[3px] bg-[#FEF987] mx-auto mt-3 rounded-full" />
            </motion.div>

            {/* Carousel */}
            <div className="relative w-5/6 lg:w-11/12 mx-auto">
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
                    spaceBetween={10}
                    watchOverflow={true}
                    breakpoints={{
                        0: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        500: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 12,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 12,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 15,
                        },
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 18,
                        },
                        1536: {
                            slidesPerView: 6,
                            spaceBetween: 20,
                        },
                    }}
                >
                    {newArrivals.map((featured, index) => (
                        <SwiperSlide
                            key={featured.id}
                            className="mb-2 rounded-lg"
                        >
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                }}
                            >
                                <Link
                                    href={`/productDetail/${featured.id}`}
                                    className="block"
                                >
                                    <CardHome featured={featured} />
                                </Link>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Previous Button */}
                {currentIndex > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute top-1/2 -translate-y-1/2 -left-[30px] sm:-left-[38px] md:-left-[43px] lg:-left-[50px] z-20 p-1 sm:p-1 md:p-2 lg:p-3 rounded-full bg-[#FEF987] shadow-md hover:shadow-lg transition-shadow duration-200"
                        aria-label="Previous products"
                    >
                        <IoIosArrowBack className="text-xl sm:text-3xl md:text-2xl lg:text-4xl text-gray-800" />
                    </motion.button>
                )}

                {/* Next Button */}
                {swiperRef.current &&
                    currentIndex <
                    newArrivals.length - slidesPerView && (
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => swiperRef.current?.slideNext()}
                            className="absolute top-1/2 -translate-y-1/2 -right-[30px] sm:-right-[38px] md:-right-[43px] lg:-right-[50px] z-20 p-1 sm:p-1 md:p-2 lg:p-3 rounded-full bg-[#FEF987] shadow-md hover:shadow-lg transition-shadow duration-200"
                            aria-label="Next products"
                        >
                            <IoIosArrowForward className="text-xl sm:text-3xl md:text-2xl lg:text-4xl text-gray-800" />
                        </motion.button>
                    )}
            </div>
        </section>
    );
};

export default NewArrival;