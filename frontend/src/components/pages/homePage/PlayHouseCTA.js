"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    FiHeart,
    FiShoppingBag,
    FiArrowRight,
    FiStar,
} from "react-icons/fi";

const PlayHouseCTA = ({
    signupHref = "/register",
    shopHref = "/products",
}) => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-[30px] sm:rounded-[40px] bg-[#E0F7FF] min-h-[280px] sm:min-h-[320px] flex items-center"
                >
                    {/* Background decorative shapes */}
                    <div className="absolute -top-20 -right-16 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#FACC15] opacity-60" />

                    <div className="absolute -bottom-24 left-[35%] w-48 h-48 rounded-full bg-[#FB7185] opacity-20" />

                    <div className="absolute top-8 right-[38%] w-4 h-4 rounded-full bg-[#FACC15]" />
                    <div className="absolute bottom-10 right-[25%] w-3 h-3 rounded-full bg-[#FB7185]" />

                    {/* Floating stars */}
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                            rotate: [0, 8, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-8 right-8 sm:right-20 text-[#FACC15] text-2xl sm:text-4xl"
                    >
                        <FiStar fill="currentColor" />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, 10, 0],
                            rotate: [0, -8, 0],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-8 right-[42%] text-[#FB7185] text-xl sm:text-3xl"
                    >
                        <FiStar fill="currentColor" />
                    </motion.div>

                    {/* Main content */}
                    <div className="relative z-10 w-full px-6 py-10 sm:px-10 lg:px-14">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 shadow-sm">
                                <FiHeart className="text-[#FB7185] text-sm" />
                                <span className="text-[10px] sm:text-xs font-bold font-poppins text-[#172033] uppercase tracking-wider">
                                    Make Play More Fun
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-poppins text-[#172033] leading-tight">
                                Join the{" "}
                                <span className="text-[#0284C7]">
                                    Play House
                                </span>{" "}
                                Club!
                            </h2>

                            <p className="mt-3 text-sm sm:text-base font-roboto text-gray-600 max-w-md leading-relaxed">
                                Save your favorite toys, keep track of your
                                orders and make your next visit even easier.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-3 mt-6">
                                <Link
                                    href={signupHref}
                                    className="inline-flex items-center gap-2 bg-[#172033] hover:bg-[#0F172A] text-white px-5 py-3 rounded-full font-poppins font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    Create Account
                                    <FiArrowRight />
                                </Link>

                                <Link
                                    href={shopHref}
                                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#0284C7] px-5 py-3 rounded-full font-poppins font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <FiShoppingBag />
                                    Explore Toys
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Toy-like floating visual */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [-3, 3, -3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="hidden md:flex absolute right-[7%] bottom-8 lg:right-[10%] lg:bottom-10 w-36 h-36 lg:w-48 lg:h-48 bg-white rounded-[35%] items-center justify-center shadow-xl rotate-3"
                    >
                        <div className="text-7xl lg:text-8xl select-none">
                            🧸
                        </div>
                    </motion.div>

                    {/* Small floating toys */}
                    <motion.div
                        animate={{ y: [0, -7, 0] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="hidden sm:block absolute right-[3%] top-[38%] text-3xl"
                    >
                        ⭐
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="hidden sm:block absolute right-[28%] top-8 text-2xl"
                    >
                        🎈
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default PlayHouseCTA;