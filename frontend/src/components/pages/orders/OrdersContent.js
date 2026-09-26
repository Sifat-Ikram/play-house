"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

const STATUS_COLORS = {
  pending: { bg: "var(--ph-primary-soft)", text: "var(--ph-primary-dark)" },
  processing: { bg: "var(--ph-accent-soft)", text: "var(--ph-accent-dark)" },
  shipped: { bg: "#9FE8CE", text: "#1E9C79" },
  delivered: { bg: "#9FE8CE", text: "#1E9C79" },
  cancelled: { bg: "#FFE7E3", text: "var(--ph-coral)" },
};

const OrdersContent = ({ initialOrders }) => {
  const { authFetch, isLoggedIn, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    if (!initialOrders && !authLoading && isLoggedIn) {
      (async () => {
        try {
          const res = await authFetch(`${baseUrl}/orders/mine`);
          if (res.ok) {
            const data = await res.json();
            setOrders(data.data);
          }
        } catch (err) {
          console.error("Client orders fetch error:", err);
        }
      })();
    }
  }, [initialOrders, authLoading, isLoggedIn, authFetch]);

  if (authLoading) return null;

  if (!isLoggedIn) {
    return (
      <div className="w-11/12 max-w-md mx-auto py-20 text-center">
        <p
          className="text-lg font-semibold text-[var(--ph-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Please log in to view your orders
        </p>
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-3xl mx-auto py-8 sm:py-12">
      <section
        className="relative isolate overflow-hidden rounded-[28px] mb-8"
        style={{ backgroundColor: "#FCD98C" }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl"
          style={{ backgroundColor: "var(--ph-primary-dark)", opacity: 0.35 }}
        />
        <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-10">
          <p
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] mb-1.5"
            style={{
              color: "var(--ph-primary-dark)",
              fontFamily: "var(--font-body)",
            }}
          >
            Your Journey With Us
          </p>
          <h1
            className="text-2xl sm:text-3xl font-semibold text-[#1E2B2B]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            My Orders
          </h1>
        </div>
      </section>

      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "var(--ph-primary-soft)" }}
          >
            <FiPackage
              className="text-2xl"
              style={{ color: "var(--ph-primary-dark)" }}
            />
          </div>
          <h2
            className="text-lg font-semibold text-[var(--ph-text)] mb-1.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No orders yet
          </h2>
          <p
            className="text-sm text-[var(--ph-text-soft)] mb-5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Time to find your next favorite toy!
          </p>
          <Link
            href="/product"
            className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-md"
            style={{
              backgroundColor: "var(--ph-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            Browse Toys
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusStyle =
              STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex items-center justify-between rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <p
                      className="text-sm font-bold text-[var(--ph-text)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Order #{order.id}
                    </p>
                    <p
                      className="text-xs text-[var(--ph-text-faint)] mt-0.5"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold capitalize"
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                      }}
                    >
                      {order.status}
                    </span>
                    <span
                      className="text-sm font-bold text-[var(--ph-text)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      BDT {Number(order.total).toLocaleString()}
                    </span>
                    <FiChevronRight className="text-[var(--ph-text-faint)]" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersContent;
