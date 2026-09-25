"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiShield,
  FiTruck,
  FiSmile,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const VALUES = [
  {
    icon: FiHeart,
    title: "Made with Love",
    desc: "Every toy is chosen with a child's joy and safety in mind.",
    bg: "#FFE7E3",
    accent: "var(--ph-coral)",
  },
  {
    icon: FiShield,
    title: "Safety First",
    desc: "Quality-checked, age-appropriate toys you can trust.",
    bg: "#9FE8CE",
    accent: "#1E9C79",
  },
  {
    icon: FiTruck,
    title: "Fast & Reliable",
    desc: "Quick delivery across the country, right to your doorstep.",
    bg: "#B9E6E3",
    accent: "var(--ph-accent)",
  },
  {
    icon: FiSmile,
    title: "Happy Customers",
    desc: "Thousands of families trust us for playful moments.",
    bg: "#FCD98C",
    accent: "var(--ph-primary-dark)",
  },
];

const STATS = [
  { number: "10,000+", label: "Happy Kids" },
  { number: "500+", label: "Toy Varieties" },
  { number: "50+", label: "Trusted Brands" },
  { number: "4.9★", label: "Customer Rating" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-[var(--ph-bg)] overflow-hidden">
      {/* ---------------- Hero ---------------- */}
      <section
        className="relative isolate overflow-hidden"
        style={{ backgroundColor: "#FCD98C" }}
      >
        <motion.div
          animate={{ y: [0, -16, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl sm:h-64 sm:w-64"
          style={{ backgroundColor: "var(--ph-primary-dark)", opacity: 0.4 }}
        />
        <motion.div
          animate={{ y: [0, 16, 0], x: [0, 10, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="pointer-events-none absolute -left-14 bottom-[-60px] h-40 w-40 rounded-full blur-3xl sm:h-56 sm:w-56"
          style={{ backgroundColor: "var(--ph-accent)", opacity: 0.3 }}
        />
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[18%] top-10 hidden text-3xl sm:block"
          style={{ color: "var(--ph-primary-dark)", opacity: 0.7 }}
        >
          ✦
        </motion.div>
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 select-none text-6xl opacity-90 sm:block sm:text-7xl lg:text-8xl xl:text-9xl"
        >
          🧸
        </motion.div>

        <div className="relative z-10 w-11/12 max-w-[1400px] mx-auto py-14 sm:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 mb-4 shadow-sm"
          >
            <HiOutlineSparkles
              className="text-sm"
              style={{ color: "var(--ph-primary-dark)" }}
            />
            <span
              className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em]"
              style={{
                color: "var(--ph-primary-dark)",
                fontFamily: "var(--font-body)",
              }}
            >
              About Play House
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1E2B2B] leading-tight max-w-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bringing joy to every little heart, one toy at a time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base md:text-lg text-[#1E2B2B]/70 max-w-xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We are a little world of wonder — built for curious minds, playful
            hearts, and the parents who cheer them on. ✨
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-7"
          >
            <Link
              href="/product"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-bold text-white shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
              style={{
                backgroundColor: "var(--ph-accent)",
                fontFamily: "var(--font-body)",
              }}
            >
              <FiShoppingBag />
              Explore Our Toys
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Our Story ---------------- */}
      <section className="w-11/12 max-w-[1200px] mx-auto py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p
              className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] mb-2"
              style={{
                color: "var(--ph-accent)",
                fontFamily: "var(--font-body)",
              }}
            >
              Our Story
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--ph-text)] leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              A little idea that grew into a world of play
            </h2>
            <p
              className="text-sm sm:text-base text-[var(--ph-text-soft)] leading-relaxed mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Play House started with a simple belief: childhood should be full
              of wonder, imagination, and laughter. What began as a small toy
              corner has grown into a trusted destination for parents and
              children across the country.
            </p>
            <p
              className="text-sm sm:text-base text-[var(--ph-text-soft)] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Today, we carefully curate toys from top brands — from cars and
              building blocks to books and musical instruments — so every child
              finds something that sparks their curiosity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div
              className="relative aspect-square rounded-[32px] sm:rounded-[40px] flex items-center justify-center overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, var(--ph-primary-soft), var(--ph-accent-soft))",
              }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-7xl sm:text-8xl md:text-9xl select-none"
              >
                🎠
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-8 left-8 text-3xl sm:text-4xl"
              >
                ⭐
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-10 right-10 text-2xl sm:text-3xl"
              >
                🎈
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section
        style={{ backgroundColor: "var(--ph-accent-dark)" }}
        className="py-12 sm:py-16"
      >
        <div className="w-11/12 max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="text-center"
            >
              <p
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{
                  color: "var(--ph-primary)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {stat.number}
              </p>
              <p
                className="mt-1 text-xs sm:text-sm font-medium text-[var(--ph-bg)]/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Values ---------------- */}
      <section className="w-11/12 max-w-[1200px] mx-auto py-14 sm:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] mb-2"
            style={{
              color: "var(--ph-accent)",
              fontFamily: "var(--font-body)",
            }}
          >
            Why Families Choose Us
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What We Stand For
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {VALUES.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 min-h-[170px] sm:min-h-[200px] border border-white/50 shadow-sm hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: value.bg }}
              >
                <div
                  className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full opacity-40"
                  style={{ backgroundColor: value.accent }}
                />
                <div
                  className="relative z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4"
                  style={{ color: value.accent }}
                >
                  <Icon className="text-xl sm:text-2xl" />
                </div>
                <h3
                  className="relative z-10 text-sm sm:text-lg font-extrabold text-[#1E2B2B] leading-tight mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="relative z-10 text-[11px] sm:text-sm text-[#1E2B2B]/70"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {value.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[30px] sm:rounded-[40px] min-h-[240px] sm:min-h-[280px] flex items-center"
            style={{ backgroundColor: "var(--ph-accent-soft)" }}
          >
            <div
              className="absolute -top-16 -right-14 w-48 h-48 sm:w-64 sm:h-64 rounded-full opacity-70"
              style={{ backgroundColor: "var(--ph-primary)" }}
            />
            <div
              className="absolute -bottom-20 left-[30%] w-40 h-40 rounded-full opacity-20"
              style={{ backgroundColor: "var(--ph-coral)" }}
            />

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:flex absolute right-[8%] bottom-6 lg:right-[10%] w-32 h-32 lg:w-40 lg:h-40 bg-[var(--ph-surface)] rounded-[35%] items-center justify-center shadow-xl rotate-3"
            >
              <div className="text-6xl lg:text-7xl select-none">🚗</div>
            </motion.div>

            <div className="relative z-10 w-full px-6 py-10 sm:px-10 lg:px-14">
              <div className="max-w-lg">
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E2B2B] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Ready to bring home some joy?
                </h2>
                <p
                  className="mt-3 text-sm sm:text-base text-[#1E2B2B]/70 max-w-md leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Discover toys made for little adventures — and moments your
                  family will cherish forever.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link
                    href="/product"
                    className="inline-flex items-center gap-2 text-white px-5 py-3 rounded-full font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "var(--ph-accent)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Shop Now
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
