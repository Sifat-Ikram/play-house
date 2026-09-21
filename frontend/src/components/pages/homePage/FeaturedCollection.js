"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import "swiper/css";
import SectionHeader from "@/components/cards/SectionHeader";

const dummyFeatured = [
    {
        id: "1",
        name: "Remote Control Stunt Car 360",
        brand_name: "Hot Wheels",
        selling_price: 2450,
        original_price: 2950,
        rating: 4.9,
        discount: "17% OFF",
        display_image_url: "/placeholder.png",
    },
    {
        id: "2",
        name: "Soft Plush Giant Teddy Bear",
        brand_name: "Barbie",
        selling_price: 1800,
        original_price: 2200,
        rating: 5.0,
        discount: "18% OFF",
        display_image_url: "/placeholder.png",
    },
    {
        id: "3",
        name: "Educational Building Blocks Set",
        brand_name: "LEGO",
        selling_price: 3200,
        original_price: 3800,
        rating: 4.8,
        discount: "15% OFF",
        display_image_url: "/placeholder.png",
    },
    {
        id: "4",
        name: "Wooden Train Track Express",
        brand_name: "Mattel",
        selling_price: 1550,
        original_price: 1900,
        rating: 4.7,
        discount: "18% OFF",
        display_image_url: "/placeholder.png",
    },
    {
        id: "5",
        name: "Electric Ride-on Supercar",
        brand_name: "BMW Kids",
        selling_price: 14500,
        original_price: 16500,
        rating: 5.0,
        discount: "12% OFF",
        display_image_url: "/placeholder.png",
    },
];

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
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        className="group relative overflow-hidden bg-white text-slate-800 border-2 border-amber-100 hover:border-[#38BDF8] shadow-sm hover:shadow-xl transition-all duration-300 rounded-tl-3xl rounded-tr-xl rounded-bl-xl rounded-br-3xl"
                                    >
                                        {/* Image Box */}
                                        <div className="relative w-full h-[130px] sm:h-[160px] md:h-[180px] lg:h-[200px] bg-gradient-to-b from-amber-50/60 via-sky-50/40 to-white overflow-hidden">
                                            <Image
                                                src={product.display_image_url}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Top Badges */}
                                            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                                <span className="bg-[#FF6B6B] text-white text-[9px] sm:text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full shadow-sm">
                                                    🔥 HOT
                                                </span>
                                                <span className="bg-[#FFDE59] text-slate-900 text-[9px] sm:text-[10px] font-bold font-poppins px-2 py-0.5 rounded-full shadow-sm border border-yellow-300">
                                                    {product.discount}
                                                </span>
                                            </div>

                                            {/* Rating Badge */}
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                                                <FiStar className="text-amber-400 fill-amber-400 text-xs" />
                                                <span className="text-[10px] font-bold text-slate-700">
                                                    {product.rating}
                                                </span>
                                            </div>

                                            {/* Floating Cart Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.15, rotate: -3 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                className="absolute bottom-2.5 right-2.5 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-[#38BDF8] hover:bg-sky-500 text-white rounded-full shadow-md transition-colors duration-200 flex items-center justify-center"
                                                aria-label="Add to cart"
                                            >
                                                <FiShoppingCart className="text-sm sm:text-base md:text-lg" />
                                            </motion.button>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-3 sm:p-4 space-y-1">
                                            <p className="text-[10px] sm:text-[11px] font-roboto font-semibold text-[#D97706] uppercase tracking-wider truncate">
                                                {product.brand_name}
                                            </p>

                                            <h3 className="text-sm sm:text-[15px] md:text-base font-semibold font-poppins text-slate-800 group-hover:text-[#38BDF8] truncate transition-colors duration-200">
                                                {product.name}
                                            </h3>

                                            {/* Price Tag */}
                                            <div className="pt-1 flex items-baseline gap-2">
                                                <p className="text-sm sm:text-base font-extrabold font-poppins text-slate-900">
                                                    BDT {product.selling_price.toLocaleString()}
                                                </p>
                                                <p className="text-[11px] sm:text-xs font-poppins text-slate-400 line-through">
                                                    BDT {product.original_price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
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