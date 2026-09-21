"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag, FiArrowRight, FiStar } from "react-icons/fi";

const PlayHouseCTA = ({ signupHref = "/register", shopHref = "/products" }) => {
    return (
        <section className="ph-section">
            <div className="ph-container">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="relative flex min-h-[280px] items-center overflow-hidden rounded-[28px] sm:min-h-[320px] sm:rounded-[36px]"
                    style={{ backgroundColor: "var(--ph-primary-soft)" }}
                >
                    {/* Background decorative shapes — single accent hue, kept sparse */}
                    <div
                        className="absolute -right-16 -top-20 h-56 w-56 rounded-full sm:h-72 sm:w-72"
                        style={{ backgroundColor: "var(--ph-accent)", opacity: 0.5 }}
                    />
                    <div
                        className="absolute -bottom-24 left-[35%] h-48 w-48 rounded-full"
                        style={{ backgroundColor: "var(--ph-coral)", opacity: 0.15 }}
                    />

                    {/* Floating stars */}
                    <motion.div
                        animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-8 top-8 text-2xl sm:right-20 sm:text-4xl"
                        style={{ color: "var(--ph-accent-dark)" }}
                    >
                        <FiStar fill="currentColor" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-8 right-[42%] text-xl sm:text-3xl"
                        style={{ color: "var(--ph-coral)" }}
                    >
                        <FiStar fill="currentColor" />
                    </motion.div>

                    {/* Main content */}
                    <div className="relative z-10 w-full px-6 py-10 sm:px-10 lg:px-14">
                        <div className="max-w-xl">
                            <div
                                className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm backdrop-blur-sm"
                                style={{ backgroundColor: "var(--ph-surface)" }}
                            >
                                <FiHeart className="text-sm" style={{ color: "var(--ph-coral)" }} />
                                <span className="eyebrow" style={{ fontSize: "0.62rem" }}>
                                    Make Play More Fun
                                </span>
                            </div>

                            <h2 className="h2" style={{ color: "var(--ph-text)" }}>
                                Join the <span style={{ color: "var(--ph-primary)" }}>Play House</span> Club!
                            </h2>

                            <p className="body-lg mt-3 max-w-md">
                                Save your favorite toys, keep track of your orders and make your next
                                visit even easier.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href={signupHref} className="ph-btn-primary">
                                    Create Account
                                    <FiArrowRight />
                                </Link>

                                <Link
                                    href={shopHref}
                                    className="ph-btn-outline"
                                    style={{ backgroundColor: "var(--ph-surface)" }}
                                >
                                    <FiShoppingBag />
                                    Explore Toys
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Toy-like floating visual */}
                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-8 right-[7%] hidden h-36 w-36 rotate-3 items-center justify-center rounded-[35%] shadow-xl md:flex lg:bottom-10 lg:right-[10%] lg:h-48 lg:w-48"
                        style={{ backgroundColor: "var(--ph-surface)" }}
                    >
                        <div className="select-none text-7xl lg:text-8xl">🧸</div>
                    </motion.div>

                    {/* Small floating toys */}
                    <motion.div
                        animate={{ y: [0, -7, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[3%] top-[38%] hidden text-3xl sm:block"
                    >
                        ⭐
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[28%] top-8 hidden text-2xl sm:block"
                    >
                        🎈
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default PlayHouseCTA;