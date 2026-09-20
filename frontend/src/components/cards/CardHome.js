"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

const CardHome = ({ product }) => {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="
        group relative overflow-hidden
        bg-white text-black
        border border-[#F1F5F9]
        shadow-sm hover:shadow-xl
        transition-all duration-300
        rounded-tl-3xl rounded-tr-lg
        rounded-bl-lg rounded-br-3xl
    "
        >
            {/* Product Image Container */}
            <div
                className="
            relative w-full
            h-[130px] sm:h-[160px]
            md:h-[180px] lg:h-[200px]
            bg-gradient-to-b
            from-sky-50/50 via-amber-50/20 to-white
            overflow-hidden
        "
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

                {/* NEW Badge */}
                <span
                    className="
                absolute top-2 left-2
                bg-[#FFDE59]
                text-[#1E293B]
                text-[9px] sm:text-[10px]
                font-bold font-poppins
                px-2.5 py-0.5
                rounded-full
                shadow-sm
                border border-yellow-300
            "
                >
                    NEW
                </span>

                {/* Cart Button */}
                <motion.button
                    whileHover={{ scale: 1.12, rotate: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Add to cart logic
                    }}
                    className="
                absolute bottom-2.5 right-2.5 z-10
                w-9 h-9 sm:w-10 sm:h-10
                bg-[#38BDF8]
                text-[#FFFFFF]
                rounded-full
                shadow-md hover:shadow-lg
                transition-colors duration-200
                flex items-center justify-center
            "
                    aria-label="Add to cart"
                >
                    <FiShoppingCart className="text-sm sm:text-base md:text-lg" />
                </motion.button>
            </div>

            {/* Product Details */}
            <div className="p-3 sm:p-4 space-y-1">
                {/* Brand */}
                <p
                    className="
                text-[10px] sm:text-[11px]
                font-roboto font-semibold
                text-[#D97706]
                uppercase tracking-wider
                truncate
            "
                >
                    {product?.brand_name || "Toy Store"}
                </p>

                {/* Product Name */}
                <h3
                    className="
                text-sm sm:text-[15px] md:text-base
                font-semibold font-poppins
                text-[#1E293B]
                truncate
                transition-colors duration-200
            "
                >
                    {product?.name || "No Name Available"}
                </h3>

                {/* Price */}
                <div className="pt-1">
                    <p
                        className="
                    text-sm sm:text-base
                    font-bold font-poppins
                    text-[#38BDF8]
                "
                    >
                        BDT{" "}
                        {product?.selling_price
                            ? Number(product.selling_price).toLocaleString()
                            : "0"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default CardHome;