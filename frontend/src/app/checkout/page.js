"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiCheckCircle,
  FiShoppingBag,
} from "react-icons/fi";
import { useCart } from "@/provider/CartProvider";
import { useAuth } from "@/provider/AuthProvider";
import { getCartToken } from "@/lib/cartToken";
import {
  BD_CITIES,
  getDeliveryOption,
  getEstimatedShippingCost,
} from "@/lib/bdCities";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://play-house-backend.vercel.app/api";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, cartTotal, refreshCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryOption = city ? getDeliveryOption(city) : null;
  const estimatedShipping = city ? getEstimatedShippingCost(city) : 0;
  const estimatedTotal = cartTotal + estimatedShipping;

  const isCartEmpty = items.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !phone || !city || !address) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isCartEmpty) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id || null,
          cart_token: getCartToken(),
          name,
          email,
          phone,
          shipping_address: address,
          city,
          delivery_option: deliveryOption,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      await refreshCart();
      router.push(`/orderSuccess/${data.data.id}`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      {/* Header strip */}
      <section
        className="relative isolate overflow-hidden"
        style={{ backgroundColor: "#FCD98C" }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-2xl sm:h-40 sm:w-40"
          style={{ backgroundColor: "var(--ph-primary-dark)", opacity: 0.35 }}
        />
        <div className="relative z-10 w-11/12 max-w-[1200px] mx-auto py-8 sm:py-10">
          <p
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] mb-1.5"
            style={{
              color: "var(--ph-primary-dark)",
              fontFamily: "var(--font-body)",
            }}
          >
            Almost There!
          </p>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1E2B2B]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Checkout
          </h1>
        </div>
      </section>

      <div className="w-11/12 max-w-[1200px] mx-auto py-8 sm:py-10">
        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--ph-primary-soft)" }}
            >
              <FiShoppingBag
                className="text-2xl"
                style={{ color: "var(--ph-primary-dark)" }}
              />
            </div>
            <h2
              className="text-lg font-semibold text-[var(--ph-text)] mb-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your cart is empty
            </h2>
            <p
              className="text-sm text-[var(--ph-text-soft)] mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Add some toys before checking out!
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
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8"
          >
            {/* LEFT: Order summary + Delivery form */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-6">
                <h2
                  className="text-base sm:text-lg font-semibold text-[var(--ph-text)] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Order Summary ({items.length}{" "}
                  {items.length === 1 ? "item" : "items"})
                </h2>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 items-center border-b border-[var(--ph-border)] pb-3 last:border-b-0"
                    >
                      <div
                        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-[var(--ph-border)]"
                        style={{
                          background:
                            "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
                        }}
                      >
                        <Image
                          src={item.display_image_url || "/placeholder.png"}
                          alt={item.product_name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs sm:text-sm font-semibold text-[var(--ph-text)] truncate"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {item.product_name}
                        </p>
                        <p
                          className="text-[11px] text-[var(--ph-text-faint)]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item.brand_name}
                          {item.color_name && ` • ${item.color_name}`} • Qty:{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p
                        className="text-xs sm:text-sm font-bold text-[var(--ph-text)] shrink-0"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        BDT{" "}
                        {(
                          Number(item.selling_price) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-6">
                <h2
                  className="text-base sm:text-lg font-semibold text-[var(--ph-text)] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)] transition-colors"
                      style={{
                        borderColor: "var(--ph-border)",
                        backgroundColor: "var(--ph-bg)",
                        color: "var(--ph-text)",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)] transition-colors"
                        style={{
                          borderColor: "var(--ph-border)",
                          backgroundColor: "var(--ph-bg)",
                          color: "var(--ph-text)",
                          fontFamily: "var(--font-body)",
                        }}
                      />
                    </div>

                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)]" />
                      <input
                        type="tel"
                        placeholder="Phone *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-full border pl-11 pr-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)] transition-colors"
                        style={{
                          borderColor: "var(--ph-border)",
                          backgroundColor: "var(--ph-bg)",
                          color: "var(--ph-text)",
                          fontFamily: "var(--font-body)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ph-text-faint)] z-10" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full appearance-none rounded-full border pl-11 pr-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)] transition-colors"
                      style={{
                        borderColor: "var(--ph-border)",
                        backgroundColor: "var(--ph-bg)",
                        color: city ? "var(--ph-text)" : "var(--ph-text-faint)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      <option value="">Select City *</option>
                      {BD_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    placeholder="Full Delivery Address *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full rounded-[20px] border px-4 py-3 text-sm outline-none focus:border-[var(--ph-primary)] transition-colors resize-none"
                    style={{
                      borderColor: "var(--ph-border)",
                      backgroundColor: "var(--ph-bg)",
                      color: "var(--ph-text)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-6">
                <h2
                  className="text-base sm:text-lg font-semibold text-[var(--ph-text)] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className="flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors"
                    style={{
                      borderColor:
                        paymentMethod === "cod"
                          ? "var(--ph-primary)"
                          : "var(--ph-border)",
                      backgroundColor:
                        paymentMethod === "cod"
                          ? "var(--ph-primary-soft)"
                          : "transparent",
                    }}
                  >
                    <FiTruck
                      className="text-xl"
                      style={{ color: "var(--ph-primary-dark)" }}
                    />
                    <div>
                      <p
                        className="text-sm font-bold text-[var(--ph-text)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Cash on Delivery
                      </p>
                      <p
                        className="text-[11px] text-[var(--ph-text-faint)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Pay when it arrives
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className="flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors relative"
                    style={{
                      borderColor:
                        paymentMethod === "card"
                          ? "var(--ph-primary)"
                          : "var(--ph-border)",
                      backgroundColor:
                        paymentMethod === "card"
                          ? "var(--ph-primary-soft)"
                          : "transparent",
                    }}
                  >
                    <FiCreditCard
                      className="text-xl"
                      style={{ color: "var(--ph-accent)" }}
                    />
                    <div>
                      <p
                        className="text-sm font-bold text-[var(--ph-text)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Card Payment
                      </p>
                      <p
                        className="text-[11px] text-[var(--ph-text-faint)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Coming soon
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Billing summary */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-6">
                <h2
                  className="text-base sm:text-lg font-semibold text-[var(--ph-text)] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Billing Summary
                </h2>

                <div
                  className="space-y-2.5 text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <div className="flex justify-between text-[var(--ph-text-soft)]">
                    <span>Item Total</span>
                    <span className="font-semibold text-[var(--ph-text)]">
                      BDT {cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--ph-text-soft)]">
                    <span>Shipping {city && `(${city})`}</span>
                    <span className="font-semibold text-[var(--ph-text)]">
                      {city ? `BDT ${estimatedShipping}` : "—"}
                    </span>
                  </div>
                  <div className="border-t border-[var(--ph-border)] pt-2.5 flex justify-between">
                    <span className="font-bold text-[var(--ph-text)]">
                      Order Total
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{
                        color: "var(--ph-primary-dark)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      BDT {estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {error && (
                  <p
                    className="mt-4 text-xs font-semibold text-[var(--ph-coral)] text-center"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {error}
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-[#1E2B2B] shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--ph-primary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <FiCheckCircle />
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </motion.button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default CheckoutPage;
