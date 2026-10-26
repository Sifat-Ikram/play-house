"use client";

import { motion } from "framer-motion";

export const authInputClass =
  "w-full rounded-full border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--ph-primary)]";

export const authInputStyle = {
  borderColor: "var(--ph-border)",
  backgroundColor: "var(--ph-bg)",
  color: "var(--ph-text)",
  fontFamily: "var(--font-body)",
};

export default function AuthShell({ eyebrow, title, children }) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--ph-border)] bg-[var(--ph-surface)] shadow-lg"
      >
        <div
          className="px-6 py-6 sm:px-8"
          style={{ backgroundColor: "#FCD98C" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{
              color: "var(--ph-primary-dark)",
              fontFamily: "var(--font-body)",
            }}
          >
            {eyebrow}
          </p>
          <h1
            className="mt-1 text-2xl font-semibold text-[#1E2B2B]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
        </div>
        <div className="px-6 py-6 sm:px-8">{children}</div>
      </motion.div>
    </div>
  );
}
