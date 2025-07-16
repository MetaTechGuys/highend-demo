import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Cart from "./components/Cart/Cart";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HighEnd Restaurant",
  description: "Premium dining experience with exquisite cuisine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Cart />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
