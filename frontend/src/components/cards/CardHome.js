"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

const CardHome = ({ product, badge, discountPercent }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="
                group relative overflow-hidden
                bg-[var(--ph-surface)] text-[var(--ph-text)]
                border border-[var(--ph-border)]
                shadow-sm hover:shadow-xl
                transition-all duration-300
                rounded-tl-3xl rounded-tr-lg
                rounded-bl-lg rounded-br-3xl
            "
        >
            {/* Corner sparkle accent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: "var(--ph-primary)", filter: "blur(18px)" }}
            />

            {/* Product Image Container */}
            <div
                className="
                    relative w-full
                    h-[130px] sm:h-[160px]
                    md:h-[180px] lg:h-[200px]
                    overflow-hidden
                "
                style={{
                    background: "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
                }}
            >
                <Image
                    src={product?.display_image_url || "/placeholder.png"}
                    alt={product?.name || "Product"}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    className="
                        object-cover
                        transition-transform duration-500
                        group-hover:scale-105
                    "
                />

                {/* Badge (NEW / HOT / etc) */}
                {badge && (
                    <span
                        className="
                            absolute top-2 left-2 z-10
                            inline-flex items-center gap-1
                            text-white
                            text-[9px] sm:text-[10px]
                            font-bold
                            px-2.5 py-1
                            rounded-full
                            shadow-md
                        "
                        style={{
                            backgroundColor: "var(--ph-accent)",
                            fontFamily: "var(--font-body)",
                        }}
                    >
                        <IoSparkles className="text-[10px]" />
                        {badge}
                    </span>
                )}

                {/* Discount ribbon */}
                {discountPercent ? (
                    <span
                        className="
                            absolute top-2 right-11 sm:right-12 z-10
                            text-white
                            text-[9px] sm:text-[10px]
                            font-extrabold
                            px-2 py-1
                            rounded-full
                            shadow-md
                        "
                        style={{
                            backgroundColor: "var(--ph-coral)",
                            fontFamily: "var(--font-body)",
                        }}
                    >
                        -{discountPercent}%
                    </span>
                ) : null}

                {/* Wishlist */}
                <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsWishlisted((prev) => !prev);
                    }}
                    className="
                        absolute top-2 right-2 z-10
                        w-7 h-7 sm:w-8 sm:h-8
                        rounded-full
                        bg-[var(--ph-surface)]/90
                        shadow-sm
                        flex items-center justify-center
                        transition-colors duration-200
                    "
                    aria-label="Add to wishlist"
                >
                    <FiHeart
                        className="text-xs sm:text-sm transition-colors"
                        style={{
                            color: isWishlisted ? "var(--ph-coral)" : "var(--ph-text-faint)",
                            fill: isWishlisted ? "var(--ph-coral)" : "none",
                        }}
                    />
                </motion.button>

                {/* Cart Button */}
                <motion.button
                    whileHover={{ scale: 1.12, rotate: -6 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Add to cart logic
                    }}
                    className="
                        absolute bottom-2.5 right-2.5 z-10
                        w-9 h-9 sm:w-10 sm:h-10
                        text-white
                        rounded-full
                        shadow-md hover:shadow-lg
                        transition-colors duration-200
                        flex items-center justify-center
                    "
                    style={{ backgroundColor: "var(--ph-accent)" }}
                    aria-label="Add to cart"
                >
                    <FiShoppingCart className="text-sm sm:text-base md:text-lg" />
                </motion.button>
            </div>

            {/* Product Details */}
            <div className="p-3 sm:p-4 space-y-1 relative">
                {/* Brand */}
                <p
                    className="
                        text-[10px] sm:text-[11px]
                        font-semibold
                        text-[var(--ph-primary-dark)]
                        uppercase tracking-wider
                        truncate
                    "
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    {product?.brand_name || "Toy Store"}
                </p>

                {/* Product Name */}
                <h3
                    className="
                        text-sm sm:text-[15px] md:text-base
                        font-semibold
                        text-[var(--ph-text)]
                        truncate
                        transition-colors duration-200
                    "
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    {product?.name || "No Name Available"}
                </h3>

                {/* Price */}
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <span
                        className="
                            inline-block
                            text-sm sm:text-base
                            font-bold
                            px-2.5 py-0.5
                            rounded-full
                        "
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "#1E2B2B",
                            backgroundColor: "var(--ph-primary-soft)",
                        }}
                    >
                        BDT{" "}
                        {product?.selling_price
                            ? Number(product.selling_price).toLocaleString()
                            : "0"}
                    </span>

                    {product?.original_price &&
                        Number(product.original_price) >
                        Number(product?.selling_price || 0) && (
                            <span
                                className="text-xs text-[var(--ph-text-faint)] line-through"
                                style={{ fontFamily: "var(--font-body)" }}
                            >
                                BDT {Number(product.original_price).toLocaleString()}
                            </span>
                        )}
                </div>
            </div>
        </motion.div>
    );
};

export default CardHome;