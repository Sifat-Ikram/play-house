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
                <p className="text-slate-500 font-poppins">Loading testimonials...</p>
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
                                className="h-full bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border-2 border-amber-100 shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
                            >
                                <FaQuoteLeft className="text-3xl text-[#FFDE59]/50 absolute top-4 right-5" />

                                <div className="space-y-3 relative z-10">
                                    {/* Product Name */}
                                    <p className="text-xs sm:text-sm font-semibold font-poppins text-slate-800 truncate pr-8">
                                        Product Name: {review.product_name}
                                    </p>

                                    <div className="space-y-1 relative z-10">
                                        <div className="flex item-center">
                                            {[...Array(review.review_rating)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className="text-amber-400 fill-amber-400 text-sm sm:text-base"
                                                />
                                            ))}
                                        </div>

                                        {/* Review Text */}
                                        <p className="text-xs sm:text-sm font-poppins text-slate-700 leading-relaxed italic">
                                            "{review.review_comment}"
                                        </p>
                                    </div>
                                </div>

                                {/* User Info (Image and Name Side by Side) */}
                                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-amber-100/80">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#38BDF8] flex-shrink-0">
                                        <Image
                                            src={review.user_image_url}
                                            alt={review.user_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h4 className="text-xs sm:text-sm font-bold font-poppins text-slate-800 truncate">
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