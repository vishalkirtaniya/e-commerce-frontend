"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import BreadCrumb from "@/components/ui/BreadCrumb";

export default function CheckoutPage() {
  return (
    <main className="max-w-[1240px] mx-auto px-4 py-10">
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="text-[32px] font-bold font-integral mt-6 mb-10">
        Checkout
      </h1>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — FORM */}
        <div className="lg:col-span-2 border rounded-2xl p-6 space-y-6">
          {/* Contact */}
          <div>
            <h2 className="font-semibold mb-4">Contact Information</h2>
            <input className="input" placeholder="Email address" />
            <input className="input mt-3" placeholder="Phone number" />
          </div>

          {/* Shipping */}
          <div>
            <h2 className="font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="input" placeholder="First Name" />
              <input className="input" placeholder="Last Name" />
            </div>
            <input className="input mt-4" placeholder="Street Address" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <input className="input" placeholder="City" />
              <input className="input" placeholder="State" />
              <input className="input" placeholder="Zip Code" />
            </div>
          </div>

          {/* Continue */}
          <Button
            text="Proceed to Payment"
            fill_background_color="bg-black"
            text_color="text-white"
            border_border_radius="rounded-full"
            className="w-full py-3"
          />
        </div>

        {/* RIGHT — SUMMARY */}
        <div className="border rounded-2xl p-6 h-fit">
          <h2 className="font-semibold mb-6">Order Summary</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$565</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Discount</span>
              <span>- $113</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>$15</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>$467</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
