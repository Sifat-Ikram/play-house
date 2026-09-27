"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import SectionHeader from "@/components/cards/SectionHeader";

const shopItems = [
  {
    _id: 1,
    title: "Baby Stars",
    age: "0-2 years",
    bg: "#B9E6E3",
    accent: "var(--ph-accent)",
    emoji: "👶",
    minAge: 0,
    maxAge: 2,
  },
  {
    _id: 2,
    title: "Little Stars",
    age: "3-5 years",
    bg: "#FCD98C",
    accent: "var(--ph-primary-dark)",
    emoji: "🧸",
    minAge: 3,
    maxAge: 5,
  },
  {
    _id: 3,
    title: "Shining Stars",
    age: "6-11 years",
    bg: "#9FE8CE",
    accent: "#1E9C79",
    emoji: "⭐",
    minAge: 6,
    maxAge: 11,
  },
  {
    _id: 4,
    title: "Super Stars",
    age: "12 and above",
    bg: "#FFC2B3",
    accent: "var(--ph-coral)",
    emoji: "🚀",
    minAge: 12,
    maxAge: Infinity,
  },
];

const ShopByAgeContent = () => {
  const searchParams = useSearchParams();
  const minAgeParam = searchParams.get("minAge");
  const maxAgeParam = searchParams.get("maxAge");

  const minAge = minAgeParam ? Number(minAgeParam) : 0;
  const maxAge = maxAgeParam ? Number(maxAgeParam) : Infinity;

  const filteredShopItems = shopItems.filter(
    (item) => item.maxAge >= minAge && item.minAge <= maxAge,
  );

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <SectionHeader subtitle="For Every Little Age" title="Shop By Age" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {filteredShopItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              whileHover={{ y: -7, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
              className="h-full"
            >
              <Link
                href={`/product?minAge=${item.minAge}&maxAge=${item.maxAge === Infinity ? "" : item.maxAge}`}
                title={`View details for ${item.title}`}
                aria-label={`View details for ${item.title}`}
                className="group relative overflow-hidden rounded-[24px] sm:rounded-[30px] p-4 sm:p-6 min-h-[150px] sm:min-h-[190px] flex flex-col justify-between border border-white/50 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full"
                style={{ backgroundColor: item.bg }}
              >
                <div
                  className="absolute -right-8 -top-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-40 transition-transform duration-500 group-hover:scale-125"
                  style={{ backgroundColor: item.accent }}
                />

                <motion.div
                  whileHover={{ rotate: 8, scale: 1.12 }}
                  className="relative z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-xl sm:text-2xl"
                >
                  {item.emoji}
                </motion.div>

                <div className="relative z-10">
                  <h3
                    className="font-extrabold text-sm sm:text-lg text-[#1E2B2B] leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-1 text-[11px] sm:text-sm text-[#1E2B2B]/70"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Age {item.age}
                  </p>
                </div>

                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ShopByAge = () => {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <ShopByAgeContent />
    </Suspense>
  );
};

export default ShopByAge;
