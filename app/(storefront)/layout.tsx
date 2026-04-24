import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/ReduxProvider";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <Header />
      {children}
      <Footer />
    </ReduxProvider>
  );
}
