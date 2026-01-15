"use client";

import Image from "next/image";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function CartPageBody() {
  const router = useRouter();
  return (
    <div className="max-w-[1240px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart" },
        ]}
      />

      {/* Title */}
      <h1 className="text-[32px] font-bold font-integral mt-6 mb-10">
        Your Cart
      </h1>

      {/* Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 border border-1 border-[#00000040] rounded-2xl p-6 space-y-6">
          {/* Cart Item */}
          {[
            {
              name: "Gradient Graphic T-shirt",
              price: 145,
              size: "Large",
              color: "White",
              image: "/images/image_8.png",
            },
            {
              name: "Checkered Shirt",
              price: 180,
              size: "Medium",
              color: "Red",
              image: "/images/image_9.png",
            },
            {
              name: "Skinny Fit Jeans",
              price: 240,
              size: "Large",
              color: "Blue",
              image: "/images/image_10.png",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 border-b border-[#00000040] last:border-b-0 pb-6 last:pb-0"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-[80px] h-[80px] bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-text-muted">
                    Size: {item.size}
                  </p>
                  <p className="text-sm text-text-muted">
                    Color: {item.color}
                  </p>
                  <p className="font-semibold mt-1">${item.price}</p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <button className="px-2">−</button>
                  <span className="px-3">1</span>
                  <button className="px-2">+</button>
                </div>

                {/* Delete */}
                <button>
                  <Image
                    src="/icons/garbage.svg"
                    alt="Remove"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border border-1 border-[#00000040] rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">$565</span>
            </div>

            <div className="flex justify-between text-red-500">
              <span>Discount (-20%)</span>
              <span>-$113</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>$15</span>
            </div>

            <div className="border-t border-[#00000040] pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>$467</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="flex gap-2 mt-6">
            <input
              type="text"
              placeholder="Add promo code"
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            />
            <Button
              text="Apply"
              fill_background_color="bg-black"
              text_color="text-white"
              border_border_radius="rounded-full"
              className="px-6"
            />
          </div>

          {/* Checkout */}
          <Button
            text="Go to Checkout →"
            fill_background_color="bg-black"
            text_color="text-white"
            border_border_radius="rounded-full"
            className="w-full mt-6 py-3"
            onClick={() => router.push("/checkout")}
          />
        </div>
      </section>
    </div>
  );
}
