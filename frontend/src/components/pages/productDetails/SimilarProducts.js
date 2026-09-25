"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const SimilarProducts = ({ products = [], brandName }) => {
  if (!products || products.length === 0) return null;

  return (
    <div>
      <h3
        className="text-lg sm:text-xl font-semibold text-[var(--ph-text)] mb-4 sm:mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        You may also like
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {products.map((product) => (
          <Link
            key={product.inventory_id || product.product_id}
            href={`/productDetails/${encodeURIComponent(product.product_name)}`}
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-tl-2xl rounded-tr-lg rounded-bl-lg rounded-br-2xl border border-[var(--ph-border)] bg-[var(--ph-surface)] overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div
                className="relative w-full h-[110px] sm:h-[140px]"
                style={{
                  background:
                    "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
                }}
              >
                <Image
                  src={product?.display_image_url || "/placeholder.png"}
                  alt={product?.product_name || "Product"}
                  fill
                  sizes="(max-width: 640px) 45vw, 20vw"
                  className="object-cover"
                />
              </div>
              <div className="p-2.5 sm:p-3">
                <p
                  className="text-xs sm:text-sm font-semibold text-[var(--ph-text)] truncate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {product.product_name}
                </p>
                <p
                  className="text-xs sm:text-sm font-bold mt-0.5"
                  style={{
                    color: "var(--ph-primary-dark)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  BDT {Number(product.selling_price || 0).toLocaleString()}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
