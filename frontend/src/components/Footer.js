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

const Footer = () => {
    return (
        <footer
            className="relative pt-14 sm:pt-20 bg-[#FFDE59]"
        >
            <div className=" w-11/12 mx-auto">
                <div className="ph-container flex flex-col gap-12 pb-12 sm:gap-14 lg:flex-row lg:justify-between lg:gap-10">

                    {/* Logo and Description */}
                    <div className="flex flex-col items-center gap-4 text-center lg:max-w-sm lg:items-start lg:text-left">
                        <Link href="/" className="inline-block">
                            <Image
                                src={logo}
                                alt="Play House Logo"
                                width={160}
                                height={90}
                                className="h-[64px] w-auto object-contain sm:h-[76px]"
                            />
                        </Link>
                        <p className="body-sm leading-relaxed">
                            By subscribing you agree to our Privacy Policy and consent to
                            receive updates from our company.
                        </p>
                    </div>

                    {/* Social Links & Newsletter */}
                    <div className="flex w-full flex-col items-center gap-7 lg:max-w-md lg:items-start">
                        <div className="flex flex-col items-center gap-3 lg:items-start">
                            <h2
                                className="text-sm font-bold tracking-wide sm:text-base"
                                style={{ fontFamily: "var(--font-display)", color: "var(--ph-text)" }}
                            >
                                Follow Us
                            </h2>
                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                                {socialLinks.map(({ href, label, Icon }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            backgroundColor: "var(--ph-surface)",
                                            border: "1px solid var(--ph-border)",
                                            color: "var(--ph-text-soft)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "var(--ph-primary)";
                                            e.currentTarget.style.borderColor = "var(--ph-primary)";
                                            e.currentTarget.style.color = "#fff";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "var(--ph-surface)";
                                            e.currentTarget.style.borderColor = "var(--ph-border)";
                                            e.currentTarget.style.color = "var(--ph-text-soft)";
                                        }}
                                    >
                                        <Icon className="text-lg" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <p className="body-sm text-center lg:text-left">
                                Join our newsletter to stay up to date on features and releases.
                            </p>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="flex flex-col gap-3 sm:flex-row"
                            >
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="w-full rounded-full px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-4 sm:max-w-[280px]"
                                    style={{
                                        border: "1px solid var(--ph-border)",
                                        backgroundColor: "var(--ph-surface)",
                                        color: "var(--ph-text)",
                                    }}
                                />
                                <button type="submit" className="ph-btn-primary w-full sm:w-auto">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="ph-container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row"
                    style={{ borderTop: "1px solid var(--ph-border)" }}
                >
                    <p className="body-sm text-center sm:text-left">
                        © {new Date().getFullYear()} Play House. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        <Link href="/privacyPolicy" className="body-sm transition-colors hover:underline" style={{ color: "var(--ph-text-soft)" }}>
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="body-sm transition-colors hover:underline" style={{ color: "var(--ph-text-soft)" }}>
                            Terms of Service
                        </Link>
                        <button
                            type="button"
                            className="body-sm cursor-pointer transition-colors hover:underline"
                            style={{ color: "var(--ph-text-soft)" }}
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