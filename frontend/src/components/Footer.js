"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/image-removebg-preview_6.webp";
import {
    AiOutlineFacebook,
    AiOutlineInstagram,
    AiOutlineLinkedin,
} from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { TbBrandYoutube } from "react-icons/tb";

const socialLinks = [
    { href: "https://facebook.com", label: "Facebook", Icon: AiOutlineFacebook },
    { href: "https://instagram.com", label: "Instagram", Icon: AiOutlineInstagram },
    { href: "https://x.com", label: "Twitter", Icon: FaXTwitter },
    { href: "https://linkedin.com", label: "LinkedIn", Icon: AiOutlineLinkedin },
    { href: "https://youtube.com", label: "YouTube", Icon: TbBrandYoutube },
];

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/categoryDetail/36", label: "Categories" },
    { href: "/brands", label: "Brands" },
    { href: "/comboOffers", label: "Combo Offers" },
    { href: "/aboutUs", label: "About Us" },
];

const careLinks = [
    { href: "/contactUs", label: "Contact Us" },
    { href: "/privacyPolicy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/faq", label: "FAQs" },
    { href: "/shippingReturns", label: "Shipping & Returns" },
];

const Footer = () => {
    return (
        <footer className="relative bg-[var(--ph-accent-dark)] pt-14 text-[var(--ph-bg)] sm:pt-20">

            {/* Soft top divider glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,transparent,var(--ph-primary),transparent)]"
            />

            <div className="mx-auto w-11/12 max-w-[1400px]">
                <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-8">

                    {/* Logo and Description */}
                    <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                        <Link href="/" className="inline-block rounded-xl bg-[var(--ph-bg)] p-2.5 transition-transform duration-200 hover:scale-[1.03]">
                            <Image
                                src={logo}
                                alt="Play House Logo"
                                width={160}
                                height={90}
                                className="h-[52px] w-auto object-contain sm:h-[60px]"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-[var(--ph-bg)]/75">
                            Bringing joy to every little heart with toys made for
                            imagination, learning, and play.
                        </p>

                        {/* Social icons */}
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                            {socialLinks.map(({ href, label, Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ph-bg)]/20 bg-[var(--ph-bg)]/10 text-[var(--ph-bg)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--ph-primary)] hover:bg-[var(--ph-primary)] hover:text-[#1E2B2B]"
                                >
                                    <Icon className="text-lg" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
                        <h2 className="font-[var(--font-display)] text-sm font-bold tracking-wide text-[var(--ph-primary)] sm:text-base">
                            Quick Links
                        </h2>
                        <ul className="flex flex-col items-center gap-2.5 sm:items-start">
                            {quickLinks.map(({ href, label }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-[var(--ph-bg)]/75 transition-colors hover:text-[var(--ph-primary)]"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
                        <h2 className="font-[var(--font-display)] text-sm font-bold tracking-wide text-[var(--ph-primary)] sm:text-base">
                            Customer Care
                        </h2>
                        <ul className="flex flex-col items-center gap-2.5 sm:items-start">
                            {careLinks.map(({ href, label }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-[var(--ph-bg)]/75 transition-colors hover:text-[var(--ph-primary)]"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
                        <h2 className="font-[var(--font-display)] text-sm font-bold tracking-wide text-[var(--ph-primary)] sm:text-base">
                            Stay Updated
                        </h2>
                        <p className="text-sm text-[var(--ph-bg)]/75">
                            Join our newsletter for new arrivals, offers, and playful
                            surprises.
                        </p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex w-full flex-col gap-3 sm:flex-row"
                        >
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full rounded-full border border-[var(--ph-bg)]/20 bg-[var(--ph-bg)]/10 px-4 py-3 text-sm font-medium text-[var(--ph-bg)] outline-none placeholder:text-[var(--ph-bg)]/50 transition-all focus:border-[var(--ph-primary)] focus:ring-4 focus:ring-[var(--ph-primary)]/20 sm:max-w-[240px]"
                            />
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ph-primary)] px-5 py-3 text-sm font-bold text-[#1E2B2B] transition-transform duration-200 hover:scale-[1.03] hover:bg-[var(--ph-primary-dark)] sm:w-auto"
                            >
                                Subscribe
                            </button>
                        </form>

                        <p className="text-xs text-[var(--ph-bg)]/55">
                            By subscribing you agree to our Privacy Policy and consent to
                            receive updates from our company.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--ph-bg)]/15 py-6 sm:flex-row">
                    <p className="text-center text-sm text-[var(--ph-bg)]/70 sm:text-left">
                        © {new Date().getFullYear()} Play House. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        <Link
                            href="/privacyPolicy"
                            className="text-sm text-[var(--ph-bg)]/70 transition-colors hover:text-[var(--ph-primary)] hover:underline"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-[var(--ph-bg)]/70 transition-colors hover:text-[var(--ph-primary)] hover:underline"
                        >
                            Terms of Service
                        </Link>
                        <button
                            type="button"
                            className="cursor-pointer text-sm text-[var(--ph-bg)]/70 transition-colors hover:text-[var(--ph-primary)] hover:underline"
                        >
                            Cookies Settings
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;