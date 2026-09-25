import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/provider/QueryProvider";
import Footer from "@/components/Footer";
import { CartProvider } from "@/provider/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/provider/AuthProvider";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Play House | A Little World of Wonder",
  description:
    "Discover toys made for little adventures — Play House brings joy to every little heart.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--ph-bg)] text-[var(--ph-text)] font-[var(--font-body)]">
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
