import React from "react";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: {
    default: "Santushti Collection | Trophy Craft",
    template: "Santushti Collection | Trophy Craft | %s",
  },
  description:
    "Discover premium fashion at Santushti Collection - your ultimate destination for casual, formal, party, and gym wear. Shop new arrivals, top-selling items with customer reviews.",
  keywords:
    "fashion store, clothing, casual wear, formal wear, party wear, gym wear, online shopping, premium fashion, new arrivals, trending clothes",
  openGraph: {
    type: "website",
    title: {
      default: "Santushti Collection | Trophy Craft",
      template: "Santushti Collection | Trophy Craft | %s",
    },
    description:
      "Shop premium fashion collections at Santushti Collection. Explore casual, formal, party & gym wear with customer reviews and fast delivery.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
