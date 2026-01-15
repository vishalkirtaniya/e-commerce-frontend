import React from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: {
    default: "SHOP.CO Fashion Store",
    template: "SHOP.CO Fashion Store | %s",
  },
  description:
    "Discover premium fashion at SHOP.CO - your ultimate destination for casual, formal, party, and gym wear. Shop new arrivals, top-selling items with customer reviews.",
  keywords:
    "fashion store, clothing, casual wear, formal wear, party wear, gym wear, online shopping, premium fashion, new arrivals, trending clothes",

  openGraph: {
    type: "website",
    title: {
      default: "SHOP.CO Fashion Store",
      template: "SHOP.CO Fashion Store | %s",
    },
    description:
      "Shop premium fashion collections at SHOP.CO. Explore casual, formal, party & gym wear with customer reviews and fast delivery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        </body>
    </html>
  );
}
