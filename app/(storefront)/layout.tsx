"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/ReduxProvider";
import CartDrawer from "@/components/CartDrawer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    function handleOpenCart() {
      setCartOpen(true);
    }
    window.addEventListener("open-cart", handleOpenCart);
    return () => window.removeEventListener("open-cart", handleOpenCart);
  }, []);

  return (
    <ReduxProvider>
      <CartDrawer
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
          window.dispatchEvent(new CustomEvent("close-cart")); // ← add this
        }}
      />
      <Header onCartClick={() => setCartOpen(true)} />
      {children}
      <Footer />
    </ReduxProvider>
  );
}
