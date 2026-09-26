"use client";

import { useState, useEffect } from "react";
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

const CheckoutContent = ({ initialProfile }) => {
  const router = useRouter();
  const { items, cartTotal, refreshCart } = useCart();
  const { user, authFetch, isLoggedIn, isLoading: authLoading } = useAuth();

  const [profile, setProfile] = useState(initialProfile);

  const [name, setName] = useState(initialProfile?.name || "");
  const [email, setEmail] = useState(initialProfile?.email || "");
  const [phone, setPhone] = useState(initialProfile?.phone_number || "");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState(initialProfile?.addresses || "");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback client-side fetch if server-side cookie read failed
  // (e.g. token expired between page loads) but user is actually logged in.
  useEffect(() => {
    if (!initialProfile && !authLoading && isLoggedIn) {
      (async () => {
        try {
          const res = await authFetch(`${baseUrl}/profile`);
          if (res.ok) {
            const data = await res.json();
            setProfile(data.data);
            setName(data.data.name || "");
            setEmail(data.data.email || "");
            setPhone(data.data.phone_number || "");
            setAddress(data.data.addresses || "");
          }
        } catch (err) {
          console.error("Client profile fetch error:", err);
        }
      })();
    }
  }, [initialProfile, isLoggedIn, authFetch, authLoading]);

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
    <div>
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
        <div className="relative z-10 w-11/12 max-w-[1300px] mx-auto py-8 sm:py-10">
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

      <div className="w-11/12 max-w-[1300px] mx-auto py-8 sm:py-10">
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
          <form onSubmit={handleSubmit}>
            {/* ---------------- Full-width order table ---------------- */}
            <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-6 mb-8 overflow-x-auto">
              <h2
                className="text-base sm:text-lg font-semibold text-[var(--ph-text)] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Order Summary ({items.length}{" "}
                {items.length === 1 ? "item" : "items"})
              </h2>

              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: "var(--ph-border)" }}
                  >
                    <th
                      className="pb-3 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-[var(--ph-text-faint)]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Product
                    </th>
                    <th
                      className="pb-3 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-[var(--ph-text-faint)] text-center"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Qty
                    </th>
                    <th
                      className="pb-3 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-[var(--ph-text-faint)] text-right"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Price
                    </th>
                    <th
                      className="pb-3 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-[var(--ph-text-faint)] text-right"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-b-0"
                      style={{ borderColor: "var(--ph-border)" }}
                    >
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border"
                            style={{
                              borderColor: "var(--ph-border)",
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
                          <div className="min-w-0">
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
                              {item.color_name && ` • ${item.color_name}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center text-xs sm:text-sm font-semibold text-[var(--ph-text)]">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-xs sm:text-sm text-[var(--ph-text-soft)]">
                        BDT {Number(item.selling_price).toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-xs sm:text-sm font-bold text-[var(--ph-text)]">
                        BDT{" "}
                        {(
                          Number(item.selling_price) * item.quantity
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ---------------- Left: delivery form | Right: billing ---------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 sm:gap-8">
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

              {/* Billing summary — order-2 on mobile/tablet (below), lg:order-2 stays right column */}
              <div className="order-2 space-y-6 lg:top-24 h-fit">
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
                      className="flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors"
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
    </div>
  );
};

export default CheckoutContent;
