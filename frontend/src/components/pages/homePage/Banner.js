"use client";

import { motion } from "framer-motion";
import { Lottie } from "lottie-react";
import animationData from "@/assets/Toyhouse Landing lottie final.json";
import Link from "next/link";


const Banner = () => {
    return (
        <section className="relative w-11/12 max-w-7xl mx-auto py-6 sm:py-12 md:py-16 overflow-hidden">
            {/* Floating Decorative Shapes */}
            <div className="absolute top-2 left-4 w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 bg-[#FDD835] opacity-50 rounded-full blur-sm -z-10 pointer-events-none" />
            <div className="absolute bottom-4 left-1/3 w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-[#4CAF50] opacity-40 rounded-full blur-sm -z-10 pointer-events-none" />

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
                {/* Left Side: Content Section */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full sm:w-1/2 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-5 lg:space-y-6 z-10"
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold dark:text-black leading-tight drop-shadow-sm">
                            Welcome to
                        </h1>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#317ff3] leading-tight drop-shadow-md">
                            Toy House!
                        </h2>
                        <p className="mt-2 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold dark:text-black leading-relaxed">
                            Let’s Bring Joy to Every Little Heart!
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link href="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 sm:px-8 py-2.5 sm:py-3.5 bg-[#317ff3] hover:bg-[#31b2f3] text-base sm:text-lg font-semibold text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer border-none outline-none"
                            >
                                Shop Now
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full sm:w-1/2 max-w-[320px] sm:max-w-none flex justify-center items-center"
                >
                    <div className="w-full aspect-square max-h-[400px] lg:max-h-[500px]">
                        <Lottie
                            src={animationData}
                            autoplay
                            loop
                            className="w-full h-full"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;