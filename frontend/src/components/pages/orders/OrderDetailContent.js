"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronLeft, FiMapPin, FiPhone, FiTruck } from "react-icons/fi";

const OrderDetailContent = ({ order }) => {
  if (!order) {
    return (
      <div className="w-11/12 max-w-md mx-auto py-20 text-center">
        <p
          className="text-lg font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Order not found
        </p>
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-3xl mx-auto py-8 sm:py-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--ph-text-soft)] hover:text-[var(--ph-text)] mb-5"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <FiChevronLeft /> Back to My Orders
      </Link>

      <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1
              className="text-xl sm:text-2xl font-semibold text-[var(--ph-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Order #{order.id}
            </h1>
            <p
              className="text-xs text-[var(--ph-text-faint)] mt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className="rounded-full px-4 py-1.5 text-xs font-bold capitalize"
            style={{
              backgroundColor: "var(--ph-primary-soft)",
              color: "var(--ph-primary-dark)",
            }}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7 mb-6">
        <h2
          className="text-base sm:text-lg font-semibold text-[var(--ph-text)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Items
        </h2>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-[var(--ph-border)] pb-3 last:border-b-0"
            >
              <div
                className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[var(--ph-border)]"
                style={{
                  background:
                    "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
                }}
              >
                <Image
                  src={item.display_image_url || "/placeholder.png"}
                  alt={item.product_name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold text-[var(--ph-text)] truncate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.product_name}
                </p>
                <p
                  className="text-[11px] text-[var(--ph-text-faint)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.color_name && `${item.color_name} • `}Qty:{" "}
                  {item.quantity}
                </p>
              </div>
              <p
                className="text-sm font-bold text-[var(--ph-text)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                BDT {(Number(item.unit_price) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery + Billing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7">
          <h2
            className="text-base font-semibold text-[var(--ph-text)] mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Delivery Details
          </h2>
          <div
            className="space-y-2 text-sm text-[var(--ph-text-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <p className="flex items-center gap-2">
              <FiMapPin /> {order.shipping_address}, {order.city}
            </p>
            <p className="flex items-center gap-2">
              <FiPhone /> {order.phone}
            </p>
            <p className="flex items-center gap-2">
              <FiTruck />{" "}
              {order.delivery_option === "INSIDE_DHAKA"
                ? "Inside Dhaka"
                : "Outside Dhaka"}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-5 sm:p-7">
          <h2
            className="text-base font-semibold text-[var(--ph-text)] mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Billing
          </h2>
          <div
            className="space-y-2 text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="flex justify-between text-[var(--ph-text-soft)]">
              <span>Subtotal</span>
              <span>BDT {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[var(--ph-text-soft)]">
              <span>Shipping</span>
              <span>BDT {Number(order.shipping_cost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-[var(--ph-text)] border-t border-[var(--ph-border)] pt-2 mt-2">
              <span>Total</span>
              <span style={{ color: "var(--ph-primary-dark)" }}>
                BDT {Number(order.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailContent;
