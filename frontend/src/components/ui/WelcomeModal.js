"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiGithub, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "@/provider/AuthProvider";

// ====== এগুলো আপনার নিজের মতো বদলান ======
const LINKS = {
  frontend: "https://github.com/Sifat-Ikram/play-house",
};
const STORAGE_KEY = "ph_welcome_seen";
const SHOW_AGAIN_AFTER_DAYS = 7; // এত দিন পর আবার দেখাবে
const SHOW_DELAY_MS = 1500;
// ==========================================

const FEATURES = [
  "Guest & logged-in cart and checkout",
  "JWT auth with refresh-token rotation",
  "Multi-filter search with autocomplete",
  "AI toy assistant (OpenRouter)",
  "Admin panel: products, inventory, orders, carts",
  "Wholesale pricing, reviews, transactional orders",
];

const STACK = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Express",
  "PostgreSQL (Neon)",
  "JWT",
  "OpenRouter",
  "Vercel",
];

const isRecentlySeen = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const days = (Date.now() - Number(raw)) / (1000 * 60 * 60 * 24);
    return days < SHOW_AGAIN_AFTER_DAYS;
  } catch {
    return false;
  }
};

const WelcomeModal = () => {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading || pathname !== "/" || user || isRecentlySeen()) return;

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLoading, pathname, user]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px] sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="About this project"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-[var(--ph-border)] bg-[var(--ph-surface)] shadow-2xl"
          >
            {/* Header */}
            <div
              className="relative overflow-hidden px-6 pb-6 pt-8 sm:px-8"
              style={{ backgroundColor: "#FCD98C" }}
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full blur-2xl"
                style={{
                  backgroundColor: "var(--ph-primary-dark)",
                  opacity: 0.35,
                }}
              />
              <motion.span
                animate={{ y: [0, -8, 0], rotate: [-6, 6, -6] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute right-6 top-5 select-none text-5xl"
              >
                🧸
              </motion.span>

              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[#1E2B2B] hover:bg-white sm:left-auto sm:right-3"
                style={{ display: "none" }}
              >
                <FiX />
              </button>

              <p
                className="relative text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{
                  color: "var(--ph-primary-dark)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Personal Portfolio Project
              </p>
              <h2
                className="relative mt-1 pr-14 text-2xl font-semibold text-[#1E2B2B] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Welcome to Play House
              </h2>
              <p
                className="relative mt-2 max-w-md text-sm text-[#1E2B2B]/75"
                style={{ fontFamily: "var(--font-body)" }}
              >
                A full-stack toy store I built from scratch: storefront, AI
                assistant and admin dashboard. Feel free to explore it like a
                real shop.
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8">
              {/* Features */}
              <h3
                className="mb-3 text-sm font-bold text-[var(--ph-text)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What's inside
              </h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-[var(--ph-text-soft)] sm:text-[13px]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <FiCheckCircle
                      className="mt-0.5 shrink-0"
                      style={{ color: "#1E9C79" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Tech stack */}
              <h3
                className="mb-3 mt-6 text-sm font-bold text-[var(--ph-text)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tech stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {STACK.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-3 py-1 text-[11px] font-semibold"
                    style={{
                      backgroundColor: "var(--ph-primary-soft)",
                      color: "var(--ph-primary-dark)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-shadow hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--ph-accent)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Start Exploring <FiArrowRight />
                </button>

                {LINKS.frontend && (
                  <a
                    href={LINKS.frontend}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold text-[var(--ph-text)] transition-colors hover:bg-[var(--ph-primary-soft)]"
                    style={{
                      borderColor: "var(--ph-border)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <FiGithub /> GitHub
                  </a>
                )}
              </div>

              <p
                className="mt-4 text-[11px] text-[var(--ph-text-faint)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                This message won't appear again for {SHOW_AGAIN_AFTER_DAYS}{" "}
                days.
              </p>
            </div>

            {/* Close (X) — সবসময় দেখা যায়, scroll করলেও */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="sticky bottom-3 float-right mb-3 mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#1E2B2B] text-white shadow-lg sm:absolute sm:bottom-auto sm:right-4 sm:top-4 sm:float-none sm:m-0 sm:bg-white/80 sm:text-[#1E2B2B]"
            >
              <FiX />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
