"use client";

import { motion } from "framer-motion";
import { Lottie } from "lottie-react";
import animationData from "@/assets/Toyhouse Landing lottie final.json";
import Link from "next/link";

const headingWords = "Welcome to".split(" ");

const Banner = () => {
    return (
        <section className="relative w-11/12 max-w-7xl mx-auto py-6 sm:py-12 md:py-16 overflow-hidden">
            {/* Floating Decorative Shapes */}
            <motion.div
                animate={{
                    y: [0, -14, 0],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-2 left-4 w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 bg-[#FDD835] opacity-50 rounded-full blur-sm -z-10 pointer-events-none"
            />
            <motion.div
                animate={{
                    y: [0, 16, 0],
                    scale: [1, 1.08, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
                className="absolute bottom-4 left-1/3 w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-[#4CAF50] opacity-40 rounded-full blur-sm -z-10 pointer-events-none"
            />
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    x: [0, 8, 0],
                }}
                transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute top-1/3 right-6 w-8 h-8 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-[#FF7043] opacity-30 rounded-full blur-sm -z-10 pointer-events-none"
            />

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
                {/* Left Side: Content Section */}
                <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-5 lg:space-y-6 z-10">
                    <div>
                        {/* Word-by-word entrance for "Welcome to" */}
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold dark:text-black leading-tight drop-shadow-sm flex flex-wrap justify-center sm:justify-start gap-x-2 sm:gap-x-3">
                            {headingWords.map((word, i) => (
                                <motion.span
                                    key={word}
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.15,
                                        ease: "easeOut",
                                    }}
                                    className="inline-block"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>

                        {/* Letter-by-letter entrance for "Toy House!" */}
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#317ff3] leading-tight drop-shadow-md flex flex-wrap justify-center sm:justify-start">
                            {"Toy House!".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20, rotate: -8 }}
                                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.3 + i * 0.05,
                                        ease: "easeOut",
                                    }}
                                    className="inline-block"
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </h2>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            className="mt-2 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold dark:text-black leading-relaxed"
                        >
                            Let's Bring Joy to Every Little Heart!
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.3 }}
                        className="pt-2"
                    >
                        <Link href="/products">
                            <motion.button
                                whileHover={{
                                    scale: 1.08,
                                    y: [0, -4, 0],
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{
                                    y: {
                                        duration: 0.4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                }}
                                className="px-6 sm:px-8 py-2.5 sm:py-3.5 bg-[#317ff3] hover:bg-[#31b2f3] text-base sm:text-lg font-semibold text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer border-none outline-none"
                            >
                                Shop Now
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Side: Lottie Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full sm:w-1/2 max-w-[320px] sm:max-w-none flex justify-center items-center relative"
                >
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-full max-h-[400px] lg:max-h-[500px]"
                    >
                        <Lottie
                            src={animationData}
                            autoplay
                            loop
                            className="w-full h-full"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;