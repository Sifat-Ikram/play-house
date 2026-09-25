"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

const OrderSuccessPage = ({ params }) => {
  const [order, setOrder] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);

      try {
        const res = await fetch(`${baseUrl}/orders/${resolvedParams.id}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    })();
  }, [params]);

  return (
    <main className="min-h-screen bg-[var(--ph-bg)] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-[var(--ph-border)] bg-[var(--ph-surface)] shadow-xl text-center"
      >
        <div
          className="relative h-28 sm:h-32 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#9FE8CE" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
            className="text-6xl select-none"
          >
            🎉
          </motion.div>
        </div>

        <div className="px-6 sm:px-8 py-7 sm:py-9">
          <FiCheckCircle
            className="mx-auto text-4xl mb-3"
            style={{ color: "#1E9C79" }}
          />

          <h1
            className="text-2xl sm:text-3xl font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Order Placed Successfully!
          </h1>

          <p
            className="mt-2 text-sm text-[var(--ph-text-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Thank you for shopping with Play House. Your toys are on their way!
            🧸
          </p>

          {order && (
            <div
              className="mt-6 rounded-2xl border p-4 text-left text-sm space-y-1.5"
              style={{
                borderColor: "var(--ph-border)",
                fontFamily: "var(--font-body)",
              }}
            >
              <div className="flex justify-between">
                <span className="text-[var(--ph-text-soft)]">Order ID</span>
                <span className="font-bold text-[var(--ph-text)]">
                  #{order.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ph-text-soft)]">Total</span>
                <span className="font-bold text-[var(--ph-text)]">
                  BDT {Number(order.total).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ph-text-soft)]">Status</span>
                <span
                  className="font-bold capitalize"
                  style={{ color: "var(--ph-primary-dark)" }}
                >
                  {order.status}
                </span>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              href="/product"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-md"
              style={{
                backgroundColor: "var(--ph-accent)",
                fontFamily: "var(--font-body)",
              }}
            >
              <FiShoppingBag /> Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold text-[var(--ph-text)]"
              style={{
                borderColor: "var(--ph-border)",
                fontFamily: "var(--font-body)",
              }}
            >
              <FiHome /> Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default OrderSuccessPage;
