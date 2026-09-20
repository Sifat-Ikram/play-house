"use client";

import { motion } from "framer-motion";

const SectionHeader = ({ subtitle, title }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            {subtitle && (
                <p className="text-[10px] sm:text-xs md:text-sm text-[#D6D049] font-medium font-poppins tracking-[0.15em] uppercase mb-0.5 sm:mb-1">
                    {subtitle}
                </p>
            )}

            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-poppins text-gray-900">
                {title}
            </h2>
        </motion.div>
    );
};

export default SectionHeader;