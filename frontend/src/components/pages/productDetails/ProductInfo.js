"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShoppingCart, FiZap } from "react-icons/fi";
import { useCart } from "@/provider/CartProvider";

const ProductInfo = ({ product, selectedInventory, onSelectInventory }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const inventoryList = product?.inventory || [];
  const inv = selectedInventory || inventoryList[0] || {};

  const inStock = Number(inv.stock_quantity || 0) > 0 && !inv.mark_unavailable;

  const discountPercent = useMemo(() => {
    const buying = Number(inv.buying_price || 0);
    const selling = Number(inv.selling_price || 0);
    if (!buying || buying <= selling) return null;
    return Math.round(((buying - selling) / buying) * 100);
  }, [inv]);

  return (
    <div className="w-full">
      {/* Brand */}
      <Link
        href={`/product?brand=${encodeURIComponent(product?.brand_name || "")}`}
        className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] hover:underline"
        style={{ color: "var(--ph-accent)", fontFamily: "var(--font-body)" }}
      >
        {product?.brand_name || "Toy Store"}
      </Link>

      {/* Title */}
      <h1
        className="mt-1.5 text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--ph-text)] leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {product?.name}
      </h1>

      {/* Stock | Warranty */}
      <div
        className="mt-2 flex items-center gap-2 text-[11px] sm:text-xs font-semibold"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <span style={{ color: inStock ? "#1E9C79" : "var(--ph-coral)" }}>
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
        {product?.warranty_info && (
          <>
            <span className="text-[var(--ph-text-faint)]">|</span>
            <span className="text-[var(--ph-text-soft)]">
              {product.warranty_info}
            </span>
          </>
        )}
      </div>

      {/* Category */}
      {product?.category_name && (
        <p
          className="mt-2 text-xs sm:text-sm text-[var(--ph-text-soft)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Category:{" "}
          <span className="font-semibold text-[var(--ph-text)]">
            {product.category_name}
          </span>
        </p>
      )}

      {/* Color swatches */}
      {inventoryList.length > 0 && (
        <div className="mt-4">
          <p
            className="text-xs sm:text-sm font-semibold text-[var(--ph-text)] mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Color:{" "}
            <span className="font-normal text-[var(--ph-text-soft)]">
              {inv.color_name || "—"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {inventoryList.map((item) => {
              const isSelected = item.id === inv.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => onSelectInventory(item)}
                  aria-label={item.color_name || "Color option"}
                  className="relative cursor-pointer h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-shadow duration-150"
                  style={{
                    backgroundColor: item.color_hex || "#CCCCCC",
                    boxShadow: isSelected
                      ? "0 0 0 2px var(--ph-surface), 0 0 0 4px var(--ph-primary)"
                      : "0 0 0 1px var(--ph-border)",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {product?.summary && (
        <p
          className="mt-10 text-sm text-[var(--ph-text-soft)] leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {product.summary}
        </p>
      )}

      {/* Price */}
      <div className="mt-4 flex items-end gap-3 flex-wrap">
        {discountPercent && (
          <span
            className="text-sm sm:text-base text-[var(--ph-text-faint)] line-through"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BDT {Number(inv.buying_price).toLocaleString()}
          </span>
        )}
        <span
          className="text-2xl sm:text-3xl font-bold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          BDT {Number(inv.selling_price || 0).toLocaleString()}
        </span>
        {discountPercent && (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
            style={{ backgroundColor: "var(--ph-coral)" }}
          >
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Quantity + Buttons */}
      <div className="mt-6">
        <div
          className="flex items-center rounded-full border overflow-hidden w-fit"
          style={{ borderColor: "var(--ph-border)" }}
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 text-lg font-bold cursor-pointer text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-bold text-[var(--ph-text)]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-10 w-10 text-lg font-bold cursor-pointer text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
          >
            +
          </button>
        </div>

        <div className=" mt-20 flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={!inStock}
            onClick={() => addToCart(inv.id, quantity)}
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--ph-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            <FiShoppingCart /> Add to Cart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={!inStock}
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[#1E2B2B] shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--ph-primary)",
              fontFamily: "var(--font-body)",
            }}
          >
            <FiZap /> Buy Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
