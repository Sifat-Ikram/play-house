"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import SectionHeader from "@/components/cards/SectionHeader";
import CardHome from "@/components/cards/CardHome";

const dummyFeatured = [
    {
        id: "1",
        name: "Remote Control Stunt Car 360",
        brand_name: "Hot Wheels",
        selling_price: 2450,
        original_price: 2950,
        display_image_url: "/placeholder.png",
    },
    {
        id: "2",
        name: "Soft Plush Giant Teddy Bear",
        brand_name: "Barbie",
        selling_price: 1800,
        original_price: 2200,
        display_image_url: "/placeholder.png",
    },
    {
        id: "3",
        name: "Educational Building Blocks Set",
        brand_name: "LEGO",
        selling_price: 3200,
        original_price: 3800,
        display_image_url: "/placeholder.png",
    },
    {
        id: "4",
        name: "Wooden Train Track Express",
        brand_name: "Mattel",
        selling_price: 1550,
        original_price: 1900,
        display_image_url: "/placeholder.png",
    },
    {
        id: "5",
        name: "Electric Ride-on Supercar",
        brand_name: "BMW Kids",
        selling_price: 14500,
        original_price: 16500,
        display_image_url: "/placeholder.png",
    },
];

const getDiscountPercent = (original, selling) => {
    if (!original || !selling || original <= selling) return null;
    return Math.round(((original - selling) / original) * 100);
};

const FeaturedCollection = () => {
    const swiperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(2);

    return (
        <section className="w-full py-6 sm:py-8 md:py-10">
            <div className="w-5/6 lg:w-11/12 mx-auto">
                {/* Section Header with Arrows */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <SectionHeader
                        subtitle="Handpicked Choice"
                        title="Featured Collection"
                    />

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
                            disabled={currentIndex >= dummyFeatured.length - slidesPerView}
                            className="nav-btn"
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
                                : 2
                        );
                    }}
                    onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
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
                    {dummyFeatured.map((product, index) => (
                        <SwiperSlide key={product.id} className="py-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <Link href={`/productDetail/${product.id}`} className="block">
                                    <CardHome
                                        product={product}
                                        badge="HOT"
                                        discountPercent={getDiscountPercent(
                                            product.original_price,
                                            product.selling_price
                                        )}
                                    />
                                </Link>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default FeaturedCollection;