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
            <section className="w-full py-8 text-center sm:py-12 md:py-14">
                <p className="body-sm">Loading testimonials...</p>
            </section>
        );
    }

    if (isError || !reviews || reviews.length === 0) return null;

    return (
        <section className="ph-section !py-8 sm:!py-12 md:!py-14">
            <div className="ph-container">
                <div className="mb-6 flex items-center justify-between sm:mb-8">
                    <SectionHeader subtitle="Happy Parents & Kids" title="What Our Customers Say" />

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
                            disabled={currentIndex >= reviews.length - slidesPerView}
                            className="nav-btn"
                            aria-label="Next"
                        >
                            <IoIosArrowForward className="text-lg sm:text-xl" />
                        </button>
                    </div>
                </div>

                {/* Swiper — equal-height slides via CSS on the slide wrapper, equal-width via fixed breakpoints */}
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setSlidesPerView(
                            typeof swiper.params.slidesPerView === "number" ? swiper.params.slidesPerView : 1
                        );
                    }}
                    onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                    slidesPerView={1}
                    spaceBetween={16}
                    className="!items-stretch"
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 16 },
                        1024: { slidesPerView: 3, spaceBetween: 20 },
                    }}
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={review.review_id} className="!h-auto py-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="ph-card relative flex h-[260px] flex-col justify-between p-5 sm:h-[280px] sm:p-6"
                            >
                                <FaQuoteLeft
                                    className="absolute right-5 top-4 text-3xl"
                                    style={{ color: "var(--ph-accent)", opacity: 0.35 }}
                                />

                                <div className="relative z-10 space-y-3 overflow-hidden">
                                    <p
                                        className="truncate pr-8 text-xs font-semibold sm:text-sm"
                                        style={{ color: "var(--ph-text)" }}
                                    >
                                        Product: {review.product_name}
                                    </p>

                                    <div className="flex items-center">
                                        {[...Array(review.review_rating)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className="text-sm sm:text-base"
                                                style={{ color: "var(--ph-accent-dark)", fill: "var(--ph-accent-dark)" }}
                                            />
                                        ))}
                                    </div>

                                    <p
                                        className="line-clamp-4 text-xs italic leading-relaxed sm:text-sm"
                                        style={{ color: "var(--ph-text-soft)" }}
                                    >
                                        "{review.review_comment}"
                                    </p>
                                </div>

                                <div
                                    className="mt-4 flex items-center gap-3 pt-4"
                                    style={{ borderTop: "1px solid var(--ph-border)" }}
                                >
                                    <div
                                        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
                                        style={{ border: "2px solid var(--ph-primary)" }}
                                    >
                                        <Image
                                            src={review.user_image_url}
                                            alt={review.user_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h4
                                        className="truncate text-xs font-bold sm:text-sm"
                                        style={{ color: "var(--ph-text)" }}
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