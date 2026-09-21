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
    { id: "1", name: "Remote Control Stunt Car 360", brand_name: "Hot Wheels", selling_price: 2450, original_price: 2950, rating: 4.9, discount: "17% OFF", display_image_url: "/placeholder.png" },
    { id: "2", name: "Soft Plush Giant Teddy Bear", brand_name: "Barbie", selling_price: 1800, original_price: 2200, rating: 5.0, discount: "18% OFF", display_image_url: "/placeholder.png" },
    { id: "3", name: "Educational Building Blocks Set", brand_name: "LEGO", selling_price: 3200, original_price: 3800, rating: 4.8, discount: "15% OFF", display_image_url: "/placeholder.png" },
    { id: "4", name: "Wooden Train Track Express", brand_name: "Mattel", selling_price: 1550, original_price: 1900, rating: 4.7, discount: "18% OFF", display_image_url: "/placeholder.png" },
    { id: "5", name: "Electric Ride-on Supercar", brand_name: "BMW Kids", selling_price: 14500, original_price: 16500, rating: 5.0, discount: "12% OFF", display_image_url: "/placeholder.png" },
];

const FeaturedCollection = () => {
    const swiperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(2);

    return (
        <section className="ph-section !py-6 sm:!py-8">
            <div className="ph-container">
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                    <SectionHeader subtitle="Handpicked Choice" title="Featured Collection" />

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

                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setSlidesPerView(
                            typeof swiper.params.slidesPerView === "number" ? swiper.params.slidesPerView : 2
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
                                        whileHover={{ y: -6 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        className="ph-card group relative overflow-hidden"
                                    >
                                        <div
                                            className="relative h-[130px] w-full overflow-hidden sm:h-[160px] md:h-[180px] lg:h-[200px]"
                                            style={{ backgroundColor: "var(--ph-bg-soft)" }}
                                        >
                                            <Image
                                                src={product.display_image_url}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
                                                <span
                                                    className="rounded-full px-2 py-0.5 text-[9px] font-bold shadow-sm sm:text-[10px]"
                                                    style={{ backgroundColor: "var(--ph-coral)", color: "#fff" }}
                                                >
                                                    🔥 Hot
                                                </span>
                                                <span
                                                    className="rounded-full px-2 py-0.5 text-[9px] font-bold shadow-sm sm:text-[10px]"
                                                    style={{ backgroundColor: "var(--ph-accent)", color: "#1E2430" }}
                                                >
                                                    {product.discount}
                                                </span>
                                            </div>

                                            <div
                                                className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 shadow-sm backdrop-blur-sm"
                                                style={{ backgroundColor: "color-mix(in srgb, var(--ph-surface) 88%, transparent)" }}
                                            >
                                                <FiStar className="text-xs" style={{ color: "var(--ph-accent-dark)", fill: "var(--ph-accent-dark)" }} />
                                                <span className="text-[10px] font-bold" style={{ color: "var(--ph-text)" }}>
                                                    {product.rating}
                                                </span>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.92 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                className="absolute bottom-2.5 right-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-colors duration-200 sm:h-10 sm:w-10"
                                                style={{ backgroundColor: "var(--ph-primary)", color: "#fff" }}
                                                aria-label="Add to cart"
                                            >
                                                <FiShoppingCart className="text-sm sm:text-base md:text-lg" />
                                            </motion.button>
                                        </div>

                                        <div className="space-y-1 p-3 sm:p-4">
                                            <p
                                                className="truncate text-[10px] font-bold uppercase tracking-wider sm:text-[11px]"
                                                style={{ color: "var(--ph-text-faint)" }}
                                            >
                                                {product.brand_name}
                                            </p>

                                            <h3
                                                className="truncate text-sm font-semibold sm:text-[15px] md:text-base"
                                                style={{ color: "var(--ph-text)" }}
                                            >
                                                {product.name}
                                            </h3>

                                            <div className="flex items-baseline gap-2 pt-1">
                                                <p className="text-sm font-bold sm:text-base" style={{ color: "var(--ph-text)" }}>
                                                    BDT {product.selling_price.toLocaleString()}
                                                </p>
                                                <p className="text-[11px] line-through sm:text-xs" style={{ color: "var(--ph-text-faint)" }}>
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