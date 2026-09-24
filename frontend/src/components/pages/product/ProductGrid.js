"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";

const SimpleProductCard = ({ product }) => (
    <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="
            group relative overflow-hidden
            bg-[var(--ph-surface)]
            border border-[var(--ph-border)]
            shadow-sm hover:shadow-xl
            transition-all duration-300
            rounded-tl-2xl sm:rounded-tl-3xl rounded-tr-md sm:rounded-tr-lg rounded-bl-md sm:rounded-bl-lg rounded-br-2xl sm:rounded-br-3xl
        "
    >
        <div
            className="relative w-full h-[90px] sm:h-[150px] md:h-[170px] lg:h-[210px] xl:h-[170px] overflow-hidden"
            style={{ background: "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))" }}
        >
            <Image
                src={product?.display_image_url || "/placeholder.png"}
                alt={product?.product_name || "Product"}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1280px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>

        <div className="p-1.5 sm:p-3 md:p-3.5 lg:p-4 space-y-0.5 sm:space-y-1">
            <p
                className="text-[7px] sm:text-[10px] md:text-[11px] font-semibold text-[var(--ph-primary-dark)] uppercase tracking-wider truncate"
                style={{ fontFamily: "var(--font-body)" }}
            >
                {product?.brand_name || "Toy Store"}
            </p>

            <h3
                className="text-[10px] sm:text-sm md:text-[15px] font-semibold text-[var(--ph-text)] truncate"
                style={{ fontFamily: "var(--font-display)" }}
            >
                {product?.product_name || "No Name Available"}
            </h3>

            <p
                className="hidden sm:block text-[11px] text-[var(--ph-text-faint)] truncate"
                style={{ fontFamily: "var(--font-body)" }}
            >
                {product?.category_name}
            </p>

            <p
                className="pt-0.5 sm:pt-1 text-[10px] sm:text-sm md:text-base font-bold text-[var(--ph-text)]"
                style={{ fontFamily: "var(--font-display)" }}
            >
                BDT{" "}
                {product?.selling_price
                    ? Number(product.selling_price).toLocaleString()
                    : "0"}
            </p>
        </div>
    </motion.div>
);

const ProductGrid = ({ products = [] }) => {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-14 sm:py-20 md:py-28">
                <div
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4"
                    style={{ backgroundColor: "var(--ph-primary-soft)" }}
                >
                    <FiPackage className="text-xl sm:text-2xl md:text-3xl" style={{ color: "var(--ph-primary-dark)" }} />
                </div>
                <h2
                    className="text-base sm:text-lg md:text-xl font-semibold text-[var(--ph-text)] mb-1 sm:mb-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    No products found
                </h2>
                <p
                    className="text-xs sm:text-sm text-[var(--ph-text-soft)] max-w-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    Try adjusting or clearing your filters to see more toys.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-5">
            {products.map((product) => (
                <Link key={product.inventory_id} href={`/productDetails/${encodeURIComponent(product.product_name)}`}>
                    <SimpleProductCard product={product} />
                </Link>
            ))}
        </div>
    );
};

export default ProductGrid;