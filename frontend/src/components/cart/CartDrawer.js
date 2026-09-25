"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/provider/CartProvider";

const CartItemRow = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex gap-3 py-4 border-b border-[var(--ph-border)] last:border-b-0">
    {/* Image */}
    <div
      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[var(--ph-border)]"
      style={{
        background:
          "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
      }}
    >
      <Image
        src={item.display_image_url || "/placeholder.png"}
        alt={item.product_name}
        fill
        sizes="96px"
        className="object-cover"
      />
    </div>

    {/* Info */}

    <div className="relative flex-1 min-w-0">
      {/* Delete */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
        className="absolute top-0 right-0 h-7 w-7 items-center justify-center cursor-pointer rounded-full text-[var(--ph-coral)] hover:bg-[var(--ph-coral)]/10 transition-colors"
      >
        <FiTrash2 className="text-sm" />
      </button>
      <div className="flex-1 min-w-0 flex flex-col">
        <p
          className="text-sm font-semibold text-[var(--ph-text)] truncate"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item.product_name}
        </p>

        <p
          className="w-full flex items-center gap-3 text-[11px] sm:text-xs text-[var(--ph-text-soft)] mt-0.5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div>{item.brand_name}</div>
          <div className="flex-1 flex items-center gap-1">
            {item.color_name && (
              <>
                {" "}
                • <span>{item.color_name}</span>
              </>
            )}
          </div>
        </p>

        <p
          className="text-sm font-bold mt-1"
          style={{
            color: "var(--ph-primary-dark)",
            fontFamily: "var(--font-display)",
          }}
        >
          BDT {Number(item.selling_price || 0).toLocaleString()}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Quantity control */}
          <div
            className="flex items-center rounded-full border overflow-hidden"
            style={{ borderColor: "var(--ph-border)" }}
          >
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="h-7 w-7 text-sm font-bold cursor-pointer text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)] disabled:opacity-40"
            >
              −
            </button>
            <span className="w-7 text-center text-xs font-bold text-[var(--ph-text)]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="h-7 w-7 text-sm font-bold cursor-pointer text-[var(--ph-text)] hover:bg-[var(--ph-primary-soft)]"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, cartTotal } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop — click outside closes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-[var(--ph-surface)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-[var(--ph-border)]">
              <div className="flex items-center gap-2">
                <FiShoppingBag
                  className="text-lg"
                  style={{ color: "var(--ph-accent)" }}
                />
                <h2
                  className="text-base sm:text-lg font-semibold text-[var(--ph-text)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Your Cart {items.length > 0 && `(${items.length})`}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-full text-[var(--ph-text-soft)] hover:bg-[var(--ph-primary-soft)]"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Scrollable items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--ph-primary-soft)" }}
                  >
                    <FiShoppingBag
                      className="text-2xl"
                      style={{ color: "var(--ph-primary-dark)" }}
                    />
                  </div>
                  <p
                    className="text-sm font-semibold text-[var(--ph-text)] mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Your cart is empty
                  </p>
                  <p
                    className="text-xs text-[var(--ph-text-faint)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Add some toys to get started! 🧸
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>

            {/* Checkout footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--ph-border)] px-4 sm:px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-sm font-semibold text-[var(--ph-text-soft)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="text-lg font-bold text-[var(--ph-text)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    BDT {cartTotal.toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center rounded-full py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundColor: "var(--ph-accent)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
