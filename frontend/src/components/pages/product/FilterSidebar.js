"use client";

import { useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

const DEFAULT_FILTER_GROUPS = [
    {
        key: "category",
        label: "Category",
        options: ["Musical Toys", "Building Blocks", "Ride-On & Vehicle Toys", "Baby Furniture & Nursery"],
    },
    {
        key: "brand",
        label: "Brand",
        options: ["LEGO", "Hot Wheels", "Barbie", "Mattel", "BMW Kids"],
    },
    {
        key: "interest",
        label: "Interest",
        options: ["Cars & Vehicles", "Puzzles & Games", "Arts & Creativity", "Robots & Tech", "Building & Blocks", "Books & Stories"],
    },
    {
        key: "occasion",
        label: "Occasion",
        options: ["Birthday Fun", "Gift for Kids", "Party & Fun", "Holiday Gifts", "Back to School", "Just Because"],
    },
    {
        key: "age",
        label: "Age Group",
        options: ["0-2 years", "3-5 years", "6-11 years", "12 and above"],
    },
];

const FilterSidebar = ({
    groups = DEFAULT_FILTER_GROUPS,
    selectedFilters = {},
    onFilterChange,
    onClearAll,
    onClose,
    showCloseButton = false,
}) => {
    const [openSections, setOpenSections] = useState(() =>
        Object.fromEntries(groups.map((g, i) => [g.key, i < 2]))
    );

    const toggleSection = (key) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isChecked = (groupKey, option) =>
        (selectedFilters[groupKey] || []).includes(option);

    const handleCheck = (groupKey, option) => {
        if (!onFilterChange) return;
        const current = selectedFilters[groupKey] || [];
        const next = current.includes(option)
            ? current.filter((o) => o !== option)
            : [...current, option];
        onFilterChange(groupKey, next);
    };

    const activeCount = Object.values(selectedFilters).reduce(
        (sum, arr) => sum + (arr?.length || 0),
        0
    );

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--ph-border)] px-4 py-4 sm:px-5">
                <div>
                    <p
                        className="text-[10px] font-bold uppercase tracking-[0.14em]"
                        style={{ color: "var(--ph-accent)", fontFamily: "var(--font-body)" }}
                    >
                        Refine
                    </p>
                    <h3
                        className="text-lg font-semibold text-[var(--ph-text)]"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Filters
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    {activeCount > 0 && (
                        <button
                            type="button"
                            onClick={onClearAll}
                            className="text-xs font-semibold text-[var(--ph-coral)] hover:underline"
                            style={{ fontFamily: "var(--font-body)" }}
                        >
                            Clear All
                        </button>
                    )}

                    {showCloseButton && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close filters"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ph-text-soft)] hover:bg-[var(--ph-primary-soft)]"
                        >
                            <FiX className="text-lg" />
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable filter groups */}
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5">
                {groups.map((group) => {
                    const isOpen = openSections[group.key];

                    return (
                        <div
                            key={group.key}
                            className="border-b border-[var(--ph-border)] py-3.5 last:border-b-0"
                        >
                            <button
                                type="button"
                                onClick={() => toggleSection(group.key)}
                                className="flex w-full items-center justify-between"
                            >
                                <span
                                    className="text-sm font-bold text-[var(--ph-text)]"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {group.label}
                                </span>
                                <FiChevronDown
                                    className={`text-sm text-[var(--ph-text-faint)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isOpen && (
                                <ul className="mt-3 space-y-2.5">
                                    {group.options.map((option) => (
                                        <li key={option}>
                                            <label className="flex cursor-pointer items-center gap-2.5">
                                                <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked(group.key, option)}
                                                        onChange={() => handleCheck(group.key, option)}
                                                        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                    />
                                                    <span
                                                        className="h-[18px] w-[18px] rounded-md border-2 transition-colors duration-150 peer-checked:border-transparent"
                                                        style={{
                                                            borderColor: "var(--ph-border)",
                                                            backgroundColor: isChecked(group.key, option)
                                                                ? "var(--ph-primary)"
                                                                : "transparent",
                                                        }}
                                                    />
                                                    {isChecked(group.key, option) && (
                                                        <svg
                                                            className="pointer-events-none absolute h-[11px] w-[11px] text-[#1E2B2B]"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z" />
                                                        </svg>
                                                    )}
                                                </span>
                                                <span
                                                    className="text-sm text-[var(--ph-text-soft)]"
                                                    style={{ fontFamily: "var(--font-body)" }}
                                                >
                                                    {option}
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FilterSidebar;