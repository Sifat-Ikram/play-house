"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

const CardHome = ({ product }) => {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="group relative bg-white text-black border border-sky-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-tl-3xl rounded-tr-lg rounded-bl-lg rounded-br-3xl overflow-hidden"
        >
            {/* Product Image Area */}
            <div className="relative w-full h-[130px] sm:h-[160px] md:h-[180px] lg:h-[200px] bg-gradient-to-b from-gray-50 to-sky-50/30 overflow-hidden">
                <Image
                    src={product?.display_image_url || "/placeholder.png"}
                    alt={product?.name || "Product"}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* NEW Badge */}
                <span className="absolute top-2 left-2 bg-[#FEF987] text-gray-900 text-[10px] sm:text-xs font-bold font-poppins px-2 py-0.5 rounded-full shadow-sm border border-yellow-300">
                    NEW
                </span>

                {/* Floating Cart Button on Bottom-Right */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Add to cart logic
                    }}
                    className="absolute bottom-2.5 right-2.5 z-10 p-2 sm:p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-md transition-colors duration-200 flex items-center justify-center"
                    aria-label="Add to cart"
                >
                    <FiShoppingCart className="text-sm sm:text-base md:text-lg" />
                </motion.button>
            </div>

            {/* Product Details */}
            <div className="p-3 sm:p-4 space-y-1">
                {/* Brand Name */}
                <p className="text-[10px] sm:text-xs font-roboto font-medium text-amber-600 uppercase tracking-wider truncate">
                    {product?.brand_name || "Toy Store"}
                </p>

                {/* Product Name */}
                <h3 className="text-xs sm:text-sm md:text-base font-bold font-poppins text-gray-800 truncate group-hover:text-sky-600 transition-colors duration-200">
                    {product?.name || "No Name Available"}
                </h3>

                {/* Price */}
                <div className="pt-1">
                    <p className="text-xs sm:text-sm md:text-base font-extrabold font-poppins text-sky-600">
                        BDT {product?.selling_price ? Number(product.selling_price).toLocaleString() : "0"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default CardHome;