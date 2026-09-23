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
            rounded-tl-3xl rounded-tr-lg rounded-bl-lg rounded-br-3xl
        "
    >
        <div
            className="relative w-full h-[130px] sm:h-[160px] md:h-[180px] overflow-hidden"
            style={{ background: "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))" }}
        >
            <Image
                src={product?.display_image_url || "/placeholder.png"}
                alt={product?.product_name || "Product"}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>

        <div className="p-3 sm:p-4 space-y-1">
            <p
                className="text-[10px] sm:text-[11px] font-semibold text-[var(--ph-primary-dark)] uppercase tracking-wider truncate"
                style={{ fontFamily: "var(--font-body)" }}
            >
                {product?.brand_name || "Toy Store"}
            </p>

            <h3
                className="text-sm sm:text-[15px] font-semibold text-[var(--ph-text)] truncate"
                style={{ fontFamily: "var(--font-display)" }}
            >
                {product?.product_name || "No Name Available"}
            </h3>

            <p
                className="text-[11px] text-[var(--ph-text-faint)] truncate"
                style={{ fontFamily: "var(--font-body)" }}
            >
                {product?.category_name}
            </p>

            <p
                className="pt-1 text-sm sm:text-base font-bold text-[var(--ph-text)]"
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
            <div className="flex flex-col items-center justify-center text-center py-20 sm:py-28">
                <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--ph-primary-soft)" }}
                >
                    <FiPackage className="text-2xl sm:text-3xl" style={{ color: "var(--ph-primary-dark)" }} />
                </div>
                <h2
                    className="text-lg sm:text-xl font-semibold text-[var(--ph-text)] mb-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    No products found
                </h2>
                <p
                    className="text-sm text-[var(--ph-text-soft)] max-w-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    Try adjusting or clearing your filters to see more toys.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {products.map((product) => (
                <Link key={product.inventory_id} href={`/productDetail/${product.product_id}`}>
                    <SimpleProductCard product={product} />
                </Link>
            ))}
        </div>
    );
};

export default ProductGrid;