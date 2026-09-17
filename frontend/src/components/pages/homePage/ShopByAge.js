"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";

const shopItems = [
    {
        _id: 1,
        title: "Baby Stars",
        age: "0-2 years",
        color: "#FFEFBF",
        minAge: 0,
        maxAge: 2,
    },
    {
        _id: 2,
        title: "Little Stars",
        age: "3-5 years",
        color: "#EBFF94",
        minAge: 3,
        maxAge: 5,
    },
    {
        _id: 3,
        title: "Shining Stars",
        age: "6-11 years",
        color: "#7DEAFF",
        minAge: 6,
        maxAge: 11,
    },
    {
        _id: 4,
        title: "Super Stars",
        age: "12 and above",
        color: "#E7D4FF",
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
        (item) => item.maxAge >= minAge && item.minAge <= maxAge
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
            },
        },
    };

    return (
        <div className="w-11/12 mx-auto py-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-center font-poppins"
            >
                Shop by Age
            </motion.h1>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mt-10"
            >
                {filteredShopItems.map((item) => (
                    <motion.div
                        key={item._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="h-full"
                    >
                        <Link
                            href={`/ageCategory/${item._id}?minAge=${item.minAge}&maxAge=${item.maxAge}`}
                            title={`View details for ${item.title}`}
                            aria-label={`View details for ${item.title}`}
                            className="rounded-3xl border-solid border-4 border-[#3E3E3E] hover:cursor-pointer p-4 lg:p-5 flex flex-col justify-center items-center text-center space-y-3 h-full shadow-sm hover:shadow-md transition-shadow"
                            style={{ backgroundColor: item.color }}
                        >
                            <h1 className="text-sm sm:text-lg lg:text-2xl font-normal font-poppins text-[#3E3E3E]">
                                {item.title}
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                                Age {item.age}
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
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