"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    FaTruckFast,
    FaShieldHalved,
    FaArrowRotateLeft,
} from "react-icons/fa6";

const TRUST_ITEMS = [
    {
        id: "delivery",
        label: "Fast Delivery",
        icon: FaTruckFast,
    },
    {
        id: "payment",
        label: "Secure Payment",
        icon: FaShieldHalved,
    },
    {
        id: "returns",
        label: "Easy Returns",
        icon: FaArrowRotateLeft,
    },
];

const itemVariants = {
    collapsed: {
        width: "100%",
    },
    expanded: {
        width: 170,
    },
};

const labelVariants = {
    collapsed: {
        opacity: 0,
        x: 10,
    },
    expanded: {
        opacity: 1,
        x: 0,
    },
};

export default function FloatingTrustBadges() {
    const [activeItem, setActiveItem] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setActiveItem(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const handleMouseEnter = (id) => {
        if (window.matchMedia("(hover: hover)").matches) {
            setActiveItem(id);
        }
    };

    const handleMouseLeave = () => {
        if (window.matchMedia("(hover: hover)").matches) {
            setActiveItem(null);
        }
    };

    const handleClick = (id, e) => {
        e.stopPropagation();
        setActiveItem((previous) => (previous === id ? null : id));
    };

    return (
        <div
            ref={containerRef}
            className="
                fixed
                right-3 sm:right-4 lg:right-6
                bottom-4 sm:bottom-6 lg:bottom-8
                z-50
                flex
                flex-col
                items-end

                /* Spacing & Sizing for Mobile (< sm) -> Tab (sm/md) -> Desktop (lg) */
                gap-1.5 sm:gap-2 lg:gap-2.5
                w-[40px] sm:w-[48px] lg:w-[60px]
                p-1 sm:p-1.5 lg:p-2
                rounded-full

                bg-black/7
                border
                border-black/5
                backdrop-blur-sm
                shadow-sm
                pointer-events-none
            "
            aria-label="Shopping benefits"
        >
            {TRUST_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                    <motion.button
                        key={item.id}
                        type="button"
                        variants={itemVariants}
                        initial="collapsed"
                        animate={isActive ? "expanded" : "collapsed"}
                        whileHover="expanded"
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                        onClick={(e) => handleClick(item.id, e)}
                        transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 30,
                            mass: 0.7,
                        }}
                        className="
                            group
                            pointer-events-auto
                            relative

                            /* Height matches outer container's inner width */
                            h-[32px] sm:h-[36px] lg:h-[44px]

                            overflow-hidden
                            rounded-full
                            flex
                            items-center
                            justify-start
                            cursor-pointer
                            outline-none
                            select-none
                            bg-black/7
                            transition-colors
                            duration-200
                            focus-visible:ring-2
                            focus-visible:ring-[var(--ph-primary)]
                            focus-visible:ring-offset-2
                            focus-visible:ring-offset-transparent
                        "
                        aria-label={item.label}
                    >
                        {/* Icon Container */}
                        <span
                            className="
                                relative
                                z-10
                                shrink-0

                                w-[32px] sm:w-[36px] lg:w-[44px]
                                h-[32px] sm:h-[36px] lg:h-[44px]

                                flex
                                items-center
                                justify-center

                                text-[var(--ph-accent)]
                                transition-all
                                duration-200
                                group-hover:text-[var(--ph-accent)]
                            "
                        >
                            <Icon
                                className="
                                    text-[13px] sm:text-[15px] lg:text-[18px]
                                    transition-transform
                                    duration-200
                                    group-hover:scale-110
                                "
                            />
                        </span>

                        {/* Label */}
                        <motion.span
                            variants={labelVariants}
                            transition={{
                                duration: 0.18,
                                ease: "easeOut",
                            }}
                            className="
                                relative
                                z-10
                                pr-3 sm:pr-3.5 lg:pr-4
                                whitespace-nowrap
                                font-semibold

                                text-[10px] sm:text-[11px] lg:text-[12px]
                                text-[var(--ph-accent)]
                            "
                        >
                            {item.label}
                        </motion.span>
                    </motion.button>
                );
            })}
        </div>
    );
}