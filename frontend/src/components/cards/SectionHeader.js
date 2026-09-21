"use client";

import { motion } from "framer-motion";

const SectionHeader = ({ subtitle, title, align = "left" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={align === "center" ? "text-center" : "text-left"}
        >
            {subtitle && (
                <p className="eyebrow mb-1 sm:mb-1.5">{subtitle}</p>
            )}

            <h2 className="h2" style={{ color: "var(--ph-text)" }}>
                {title}
            </h2>
        </motion.div>
    );
};

export default SectionHeader;