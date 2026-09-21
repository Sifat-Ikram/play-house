"use client";

import { motion } from "framer-motion";
import { Lottie } from "lottie-react";
import animationData from "@/assets/Toyhouse Landing lottie final.json";
import Link from "next/link";

const headingWords = "Welcome to".split(" ");

const Banner = () => {
    return (
        <section
            className="relative isolate w-full overflow-hidden transition-colors duration-300"
        >
            {/* Soft premium background atmosphere */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-28 -top-32 h-64 w-64 rounded-full blur-3xl sm:h-80 sm:w-80"
                style={{ backgroundColor: "var(--ph-accent)", opacity: 0.18 }}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-28 top-1/3 h-72 w-72 rounded-full blur-3xl sm:h-96 sm:w-96"
                style={{ backgroundColor: "var(--ph-primary-soft)", opacity: 0.9 }}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[-120px] left-1/3 h-64 w-64 rounded-full blur-3xl"
                style={{ backgroundColor: "var(--ph-coral)", opacity: 0.12 }}
            />

            {/* Floating decorative bubbles */}
            <motion.div
                animate={{ y: [0, -16, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute left-[5%] top-[12%] h-12 w-12 rounded-full blur-[2px] sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-36 lg:w-36"
                style={{ backgroundColor: "var(--ph-accent)", opacity: 0.35 }}
            />

            <motion.div
                animate={{ y: [0, 18, 0], x: [0, 8, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="pointer-events-none absolute bottom-[12%] left-[28%] h-9 w-9 rounded-full blur-[2px] sm:h-14 sm:w-14 md:h-20 md:w-20"
                style={{ backgroundColor: "var(--ph-mint)", opacity: 0.3 }}
            />

            <motion.div
                animate={{ y: [0, -12, 0], x: [0, -7, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="pointer-events-none absolute right-[7%] top-[18%] h-8 w-8 rounded-full blur-[2px] sm:h-12 sm:w-12 md:h-16 md:w-16"
                style={{ backgroundColor: "var(--ph-coral)", opacity: 0.3 }}
            />

            {/* Small decorative stars */}
            <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute right-[31%] top-[16%] hidden text-2xl md:block lg:text-3xl"
                style={{ color: "var(--ph-accent-dark)", opacity: 0.7 }}
            >
                ✦
            </motion.div>

            <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -12, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="pointer-events-none absolute bottom-[20%] right-[10%] hidden text-xl sm:block"
                style={{ color: "var(--ph-coral)", opacity: 0.7 }}
            >
                ✦
            </motion.div>

            {/* Main content */}
            <div className="relative z-10 mx-auto flex min-h-[500px] w-[92%] max-w-full flex-col items-center justify-between gap-5 py-8 sm:min-h-[580px] sm:w-[90%] sm:flex-row sm:gap-8 sm:py-10 md:min-h-[620px] md:py-12 lg:min-h-[650px] lg:gap-12 lg:py-14 xl:min-h-[680px]">

                {/* LEFT CONTENT */}
                <div className="relative z-20 flex w-full flex-col items-center text-center sm:w-[48%] sm:items-start sm:text-left lg:w-[47%]">

                    {/* Small premium label */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                        className="mb-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
                        style={{
                            border: "1px solid var(--ph-accent-dark)",
                            backgroundColor: "var(--ph-bg-soft)",
                        }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--ph-accent-dark)" }} />
                        <span className="eyebrow" style={{ fontSize: "0.62rem" }}>
                            A little world of wonder
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <div className="w-full">
                        <h1
                            className="flex flex-wrap justify-center gap-x-2 sm:justify-start sm:gap-x-3"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 600,
                                fontSize: "clamp(1.9rem, 1.3rem + 3vw, 4.2rem)",
                                lineHeight: 1.05,
                                letterSpacing: "-0.02em",
                                color: "var(--ph-text)",
                            }}
                        >
                            {headingWords.map((word, i) => (
                                <motion.span
                                    key={word}
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    className="inline-block"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>

                        {/* Play House */}
                        <h2
                            className="mt-1 flex flex-wrap justify-center sm:justify-start"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: "clamp(2.6rem, 1.8rem + 4vw, 5.2rem)",
                                lineHeight: 0.98,
                                letterSpacing: "-0.03em",
                                color: "var(--ph-primary)",
                            }}
                        >
                            {"Play House!".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 22, rotate: -8 }}
                                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                                    transition={{ duration: 0.42, delay: 0.48 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                                    className="inline-block"
                                    style={{ filter: "drop-shadow(0 7px 18px rgba(47,111,237,0.18))" }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </h2>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 1.05, ease: "easeOut" }}
                            className="body-lg mx-auto mt-4 max-w-[520px] font-semibold sm:mx-0"
                        >
                            Let's bring joy to every little heart!
                        </motion.p>

                        {/* Small supporting line */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.25 }}
                            className="body-sm mt-2 font-medium tracking-wide"
                            style={{ color: "var(--ph-text-faint)" }}
                        >
                            Discover toys made for little adventures ✨
                        </motion.p>
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 1.4, ease: "easeOut" }}
                        className="mt-6 sm:mt-7"
                    >
                        <Link href="/products" className="ph-btn-primary group px-6 py-3 shadow-[0_12px_28px_-8px_rgba(47,111,237,0.4)] hover:-translate-y-1 sm:px-7 sm:py-3.5">
                            <span>Shop Now</span>
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm"
                            >
                                →
                            </motion.span>
                        </Link>
                    </motion.div>
                </div>

                {/* RIGHT LOTTIE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex w-full items-center justify-center sm:w-[52%] lg:w-[53%]"
                >
                    {/* Soft glow behind animation */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute h-[190px] w-[190px] rounded-full blur-3xl sm:h-[280px] sm:w-[280px] md:h-[350px] md:w-[350px] lg:h-[420px] lg:w-[420px]"
                        style={{ backgroundColor: "var(--ph-primary-soft)", opacity: 0.9 }}
                    />

                    {/* Premium glass frame */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative flex w-full max-w-[330px] items-center justify-center sm:max-w-[430px] md:max-w-[500px] lg:max-w-[570px] xl:max-w-[620px]"
                    >
                        {/* Decorative rings */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute h-[76%] w-[76%] rounded-full"
                            style={{ border: "1px solid var(--ph-border)" }}
                        />

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute h-[68%] w-[68%] rounded-full border border-dashed"
                            style={{ borderColor: "var(--ph-border)" }}
                        />

                        <Lottie
                            src={animationData}
                            autoplay
                            loop
                            className="relative z-10 h-auto w-full object-contain"
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom fade into next section */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
                style={{
                    background: "linear-gradient(to top, var(--ph-bg-soft), transparent)",
                    opacity: 0.7,
                }}
            />
        </section>
    );
};

export default Banner;