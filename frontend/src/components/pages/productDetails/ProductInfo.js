"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiZap,
  FiChevronDown,
  FiBox,
  FiUserCheck,
  FiTag,
} from "react-icons/fi";
import { useCart } from "@/provider/CartProvider";
import NotifyMe from "./NotifyMe";

const ProductInfo = ({ product, selectedInventory, onSelectInventory }) => {
  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState("age");

  const toggleAccordion = (name) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
  };

  const inventoryList = product?.inventory || [];
  const inv = selectedInventory || inventoryList[0] || {};

  const inStock = Number(inv.stock_quantity || 0) > 0 && !inv.mark_unavailable;

  // Check if inventory has valid color data
  const hasColorVariants = inventoryList.some(
    (item) => item.color_hex || item.color_name,
  );

  // Discount calculation fix: Check if buying_price/mrp exists and is greater than selling_price
  const discountPercent = useMemo(() => {
    const originalPrice = Number(inv.buying_price || 0); // Consider renaming backend key to mrp/regular_price if buying_price means cost price
    const selling = Number(inv.selling_price || 0);
    if (!originalPrice || originalPrice <= selling) return null;
    return Math.round(((originalPrice - selling) / originalPrice) * 100);
  }, [inv]);

  const handleBuyNow = async () => {
    if (!inStock) return;

    const success = await addToCart(inv.id, quantity);

    if (success) {
      router.push("/checkout");
    }
  };

  return (
    <div className="w-full">
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
      {/* Stock | Warranty | Age Group */}
      <div
        className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-semibold"
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
      {/* Color Swatches (Only shown if color data exists) */}
      {hasColorVariants && (
        <div className="mt-4 flex items-center gap-3">
          <p
            className="text-xs sm:text-sm font-semibold text-[var(--ph-text)] shrink-0"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Color:
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            {inventoryList.map((item) => {
              if (!item.color_hex && !item.color_name) return null;
              const isSelected = item.id === inv.id;
              return (
                <div key={item.id} className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={() => onSelectInventory(item)}
                    aria-label={`Color: ${item.color_name || "Color option"}`}
                    className="relative cursor-pointer h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-shadow duration-150"
                    style={{
                      backgroundColor: item.color_hex || "#CCCCCC",
                      boxShadow: isSelected
                        ? "0 0 0 2px var(--ph-surface), 0 0 0 4px var(--ph-primary)"
                        : "0 0 0 1px var(--ph-border)",
                    }}
                  />
                  <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--ph-text)] px-2 py-1 text-[10px] font-semibold text-[var(--ph-surface)] opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                    {item.color_name || "Color"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Materials & Key Highlights */}
      {product?.materials?.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-[var(--ph-text-soft)] flex items-center gap-1 mr-1">
            <FiTag className="text-xs" /> Key Ingredients:
          </span>
          {product.materials.map((mat, idx) => (
            <span
              key={idx}
              className="rounded-md border px-2 py-0.5 text-[11px] font-medium text-[var(--ph-text)]"
              style={{ borderColor: "var(--ph-border)" }}
            >
              {mat}
            </span>
          ))}
        </div>
      )}
      {/* Price Section */}
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
      {/* Quantity & Purchase Buttons */}
      <div className="mt-5">
        <div
          className="flex items-center rounded-full border overflow-hidden w-fit"
          style={{ borderColor: "var(--ph-border)" }}
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 text-lg font-bold cursor-pointer text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)] transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-bold text-[var(--ph-text)]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-10 w-10 text-lg font-bold cursor-pointer text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)] transition-colors"
          >
            +
          </button>
        </div>

        {/* Product Information Accordions */}
        <div className="mt-4 space-y-2">
          {/* Age Range */}
          {(product?.minimum_age_range != null ||
            product?.maximum_age_range != null) && (
            <div
              className="border rounded-xl overflow-hidden"
              style={{ borderColor: "var(--ph-border)" }}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("age")}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--ph-surface)]"
              >
                <span className="text-xs sm:text-sm font-bold text-[var(--ph-text)]">
                  Age Range
                </span>
                <FiChevronDown
                  className={`text-sm text-[var(--ph-text-faint)] transition-transform duration-200 ${
                    openAccordion === "age" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openAccordion === "age" && (
                <div className="px-4 py-3 text-xs sm:text-sm text-[var(--ph-text-soft)] border-t border-[var(--ph-border)]">
                  {product.minimum_age_range ?? 0}
                  {" - "}
                  {product.maximum_age_range ?? "3+"} Years
                </div>
              )}
            </div>
          )}
          {/* Interest */}
          {product?.interest && (
            <div
              className="border rounded-xl overflow-hidden"
              style={{ borderColor: "var(--ph-border)" }}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("interest")}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--ph-surface)]"
              >
                <span className="text-xs sm:text-sm font-bold text-[var(--ph-text)]">
                  Interest
                </span>
                <FiChevronDown
                  className={`text-sm text-[var(--ph-text-faint)] transition-transform duration-200 ${
                    openAccordion === "interest" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openAccordion === "interest" && (
                <div className="px-4 py-3 text-xs sm:text-sm text-[var(--ph-text-soft)]">
                  {product.interest}
                </div>
              )}
            </div>
          )}

          {/* Occasion */}
          {product?.occasion && (
            <div
              className="border rounded-xl overflow-hidden"
              style={{ borderColor: "var(--ph-border)" }}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("occasion")}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--ph-surface)]"
              >
                <span className="text-xs sm:text-sm font-bold text-[var(--ph-text)]">
                  Occasion
                </span>
                <FiChevronDown
                  className={`text-sm text-[var(--ph-text-faint)] transition-transform duration-200 ${
                    openAccordion === "occasion" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openAccordion === "occasion" && (
                <div className="px-4 py-3 text-xs sm:text-sm text-[var(--ph-text-soft)] border-t border-[var(--ph-border)]">
                  {product.occasion}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={!inStock}
            onClick={async () => {
              const success = await addToCart(inv.id, quantity);

              if (success) {
                openCart();
              }
            }}
            className="flex-1 cursor-pointer min-w-[140px] inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--ph-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            <FiShoppingCart /> Add to Cart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={!inStock}
            onClick={handleBuyNow}
            className="flex-1 cursor-pointer min-w-[140px] inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[#1E2B2B] shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--ph-primary)",
              fontFamily: "var(--font-body)",
            }}
          >
            <FiZap /> Buy Now
          </motion.button>
        </div>
        {!inStock && <NotifyMe inventoryId={inv.id} />}
      </div>
    </div>
  );
};

export default ProductInfo;
