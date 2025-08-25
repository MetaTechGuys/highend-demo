import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Cart from "./components/Cart/Cart";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "رستوران های اند | HighEnd Restaurant",
  description:
    "تجربه غذاخوری لوکس با غذاهای عالی | Premium dining experience with exquisite cuisine",
  keywords: [
    "رستوران تهران",
    "غذای ایرانی",
    "سفارش آنلاین غذا",
    "رستوران لوکس",
    "Tehran restaurant",
    "Persian food",
    "online food delivery",
    "luxury dining",
    "HighEnd restaurant",
    "Iranian cuisine",
    "food delivery Tehran",
  ],
  icons: {
    icon: [{ url: "/images/favicon.webp" }],
    apple: [
      { url: "/images/favicon.webp", sizes: "64x64", type: "image/webp" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <LanguageProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Cart />
          </CartProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
