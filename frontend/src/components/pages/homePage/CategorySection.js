"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    IoIosArrowBack,
    IoIosArrowForward,
} from "react-icons/io";

import "swiper/css";

import useCategory from "@/hooks/useCategory";

const CategorySection = () => {
    const swiperRef = useRef(null);

    const {
        categories,
        isLoading,
        isError,
    } = useCategory();

    /* ---------------- Loading ---------------- */

    if (isLoading) {
        return (
            <section className="w-5/6 lg:w-11/12 mx-auto py-8 sm:py-10 md:py-12">
                {/* Header Skeleton */}
                <div className="text-center mb-7 sm:mb-9 md:mb-11">
                    <div className="w-28 sm:w-36 h-5 sm:h-7 bg-gray-200 rounded mx-auto animate-pulse" />

                    <div className="w-12 sm:w-16 h-[3px] bg-gray-200 rounded mx-auto mt-3" />
                </div>

                {/* Cards Skeleton */}
                <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="flex flex-col items-center min-w-[100px] sm:min-w-[130px] md:min-w-[150px]"
                        >
                            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gray-200 animate-pulse" />

                            <div className="w-16 sm:w-24 h-3 bg-gray-200 rounded mt-3 animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    /* ---------------- Error ---------------- */

    if (isError) {
        return (
            <section className="w-5/6 lg:w-11/12 mx-auto py-8 text-center">
                <p className="text-gray-500 font-roboto">
                    Unable to load categories.
                </p>
            </section>
        );
    }

    /* ---------------- Empty ---------------- */

    if (!categories?.length) {
        return null;
    }

    /* ---------------- Main Section ---------------- */

    return (
        <section className="w-5/6 lg:w-11/12 mx-auto py-8 sm:py-10 md:py-12">
            {/* Section Header */}
            <div className="text-center mb-7 sm:mb-9 md:mb-11">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                >
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 font-roboto tracking-[0.15em] uppercase mb-1 sm:mb-2">
                        Shop By
                    </p>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-poppins text-gray-900">
                        Categories
                    </h2>

                    <div className="w-12 sm:w-16 h-[3px] bg-[#FEF987] mx-auto mt-3 rounded-full" />
                </motion.div>
            </div>

            {/* Carousel */}
            <div className="relative">
                {/* Previous Button */}
                <motion.button
                    whileHover={{
                        scale: 1.08,
                    }}
                    whileTap={{
                        scale: 0.92,
                    }}
                    onClick={() =>
                        swiperRef.current?.slidePrev()
                    }
                    className="absolute top-1/2 -translate-y-1/2 left-[-30px] sm:left-[-38px] md:left-[-43px] lg:left-[-50px] z-20 p-[5px] sm:p-2 rounded-full bg-[#FEF987] shadow-md hover:shadow-lg transition-shadow duration-200"
                    aria-label="Previous category"
                >
                    <IoIosArrowBack className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800" />
                </motion.button>

                {/* Next Button */}
                <motion.button
                    whileHover={{
                        scale: 1.08,
                    }}
                    whileTap={{
                        scale: 0.92,
                    }}
                    onClick={() =>
                        swiperRef.current?.slideNext()
                    }
                    className="absolute top-1/2 -translate-y-1/2 right-[-30px] sm:right-[-38px] md:right-[-43px] lg:right-[-50px] z-20 p-[5px] sm:p-2 rounded-full bg-[#FEF987] shadow-md hover:shadow-lg transition-shadow duration-200"
                    aria-label="Next category"
                >
                    <IoIosArrowForward className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800" />
                </motion.button>

                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerView={2.2}
                    spaceBetween={10}
                    centeredSlides={false}
                    watchOverflow={true}
                    breakpoints={{
                        0: {
                            slidesPerView: 2.2,
                            spaceBetween: 10,
                        },

                        420: {
                            slidesPerView: 2.5,
                            spaceBetween: 12,
                        },

                        640: {
                            slidesPerView: 3.5,
                            spaceBetween: 15,
                        },

                        768: {
                            slidesPerView: 4,
                            spaceBetween: 18,
                        },

                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },

                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 22,
                        },

                        1536: {
                            slidesPerView: 5.5,
                            spaceBetween: 25,
                        },
                    }}
                >
                    {categories.map((category, index) => (
                        <SwiperSlide
                            key={category.category_id}
                        >
                            <Link
                                href={`/categoryDetail/${category.category_id}`}
                                className="block group"
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
                                        duration: 0.45,
                                        delay: index * 0.05,
                                    }}
                                    className="flex flex-col items-center justify-center py-2 sm:py-3"
                                >
                                    {/* Category Image */}
                                    <motion.div
                                        whileHover={{
                                            scale: 1.08,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                        }}
                                        className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300 group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
                                    >
                                        <Image
                                            src={
                                                category?.category_image ||
                                                "/placeholder.png"
                                            }
                                            alt={
                                                category?.category_name ||
                                                "Category"
                                            }
                                            fill
                                            sizes="
                                                (max-width: 420px) 64px,
                                                (max-width: 640px) 96px,
                                                (max-width: 1024px) 128px,
                                                128px
                                            "
                                            className="rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </motion.div>

                                    {/* Category Name */}
                                    <motion.h3
                                        whileHover={{
                                            y: -2,
                                        }}
                                        className="text-center font-roboto font-bold text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 mt-2 sm:mt-3 line-clamp-2 max-w-[100px] sm:max-w-[130px] md:max-w-[160px]"
                                    >
                                        {category?.category_name}
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

export default CategorySection;