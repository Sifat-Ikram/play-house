"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiStar } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import useReviews from "@/hooks/useReviews";
import SectionHeader from "@/components/cards/SectionHeader";

const Testimonial = () => {
    const swiperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(1);

    const { reviews, isLoading, isError } = useReviews();

    if (isLoading) {
        return (
            <section className="w-full py-8 sm:py-12 md:py-14 text-center">
                <p className="text-[var(--ph-text-faint)]" style={{ fontFamily: "var(--font-body)" }}>
                    Loading testimonials...
                </p>
            </section>
        );
    }

    if (isError || !reviews || reviews.length === 0) {
        return null;
    }

    return (
        <section className="w-full py-8 sm:py-12 md:py-14">
            <div className="w-5/6 lg:w-11/12 mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <SectionHeader
                        subtitle="Happy Parents & Kids"
                        title="What Our Customers Say"
                    />

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            disabled={currentIndex === 0}
                            className="nav-btn disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous"
                        >
                            <IoIosArrowBack className="text-lg sm:text-xl" />
                        </button>

                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            disabled={currentIndex >= reviews.length - slidesPerView}
                            className="nav-btn disabled:opacity-50 disabled:cursor-not-allowed"
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
                                : 1
                        );
                    }}
                    onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                    slidesPerView={1}
                    spaceBetween={16}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 16 },
                        1024: { slidesPerView: 3, spaceBetween: 20 },
                    }}
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={review.review_id} className="py-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="h-full p-5 sm:p-6 rounded-3xl border shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
                                style={{
                                    backgroundColor: "var(--ph-surface)",
                                    borderColor: "var(--ph-primary)",
                                    borderWidth: "2px",
                                }}
                            >
                                <FaQuoteLeft
                                    className="text-3xl absolute top-4 right-5"
                                    style={{ color: "var(--ph-primary)", opacity: 0.35 }}
                                />

                                <div className="space-y-3 relative z-10">
                                    {/* Product Name */}
                                    <p
                                        className="text-xs sm:text-sm font-semibold text-[var(--ph-text)] truncate pr-8"
                                        style={{ fontFamily: "var(--font-body)" }}
                                    >
                                        Product Name: {review.product_name}
                                    </p>

                                    <div className="space-y-1 relative z-10">
                                        <div className="flex item-center">
                                            {[...Array(review.review_rating)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className="text-sm sm:text-base"
                                                    style={{
                                                        color: "var(--ph-primary)",
                                                        fill: "var(--ph-primary)",
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Review Text */}
                                        <p
                                            className="text-xs sm:text-sm text-[var(--ph-text-soft)] leading-relaxed italic"
                                            style={{ fontFamily: "var(--font-body)" }}
                                        >
                                            "{review.review_comment}"
                                        </p>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div
                                    className="flex items-center gap-3 pt-4 mt-4 border-t"
                                    style={{ borderColor: "var(--ph-border)" }}
                                >
                                    <div
                                        className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2"
                                        style={{ borderColor: "var(--ph-accent)" }}
                                    >
                                        <Image
                                            src={review.user_image_url}
                                            alt={review.user_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h4
                                        className="text-xs sm:text-sm font-bold text-[var(--ph-text)] truncate"
                                        style={{ fontFamily: "var(--font-body)" }}
                                    >
                                        {review.user_name}
                                    </h4>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Testimonial;