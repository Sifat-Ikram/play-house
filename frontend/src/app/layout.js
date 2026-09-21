import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import QueryProvider from "@/provider/QueryProvider";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Play House | Toys, Gifts & Little Adventures",
  description:
    "Discover playful toys, gifts and little adventures for every age at Play House.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#101315" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${fredoka.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white font-[var(--font-jakarta)] text-[15px] text-[#1E2430] antialiased transition-colors duration-300 dark:bg-[#101315] dark:text-[#F4F6F7] sm:text-base">
        <QueryProvider>
          <Navbar />
          <main className="min-h-screen flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}