"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

const CardHome = ({ product, badge }) => {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="ph-card group relative overflow-hidden"
        >
            {/* Product Image Container */}
            <div
                className="relative h-[130px] w-full overflow-hidden sm:h-[160px] md:h-[180px] lg:h-[200px]"
                style={{ backgroundColor: "var(--ph-bg-soft)" }}
            >
                <Image
                    src={product?.display_image_url || "/placeholder.png"}
                    alt={product?.name || "Product"}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {badge && (
                    <span
                        className="absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[9px] font-bold shadow-sm sm:text-[10px]"
                        style={{ backgroundColor: "var(--ph-accent)", color: "#1E2430" }}
                    >
                        {badge}
                    </span>
                )}

                {/* Cart Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Add to cart logic
                    }}
                    className="absolute bottom-2.5 right-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-colors duration-200 sm:h-10 sm:w-10"
                    style={{ backgroundColor: "var(--ph-primary)", color: "#fff" }}
                    aria-label="Add to cart"
                >
                    <FiShoppingCart className="text-sm sm:text-base md:text-lg" />
                </motion.button>
            </div>

            {/* Product Details */}
            <div className="space-y-1 p-3 sm:p-4">
                <p
                    className="truncate text-[10px] font-bold uppercase tracking-wider sm:text-[11px]"
                    style={{ color: "var(--ph-text-faint)" }}
                >
                    {product?.brand_name || "Toy Store"}
                </p>

                <h3
                    className="truncate text-sm font-semibold sm:text-[15px] md:text-base"
                    style={{ color: "var(--ph-text)" }}
                >
                    {product?.name || "No Name Available"}
                </h3>

                <p className="pt-1 text-sm font-bold sm:text-base" style={{ color: "var(--ph-primary)" }}>
                    BDT{" "}
                    {product?.selling_price ? Number(product.selling_price).toLocaleString() : "0"}
                </p>
            </div>
        </motion.div>
    );
};

export default CardHome;