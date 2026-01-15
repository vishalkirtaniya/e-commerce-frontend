"use client";

import Image from "next/image";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import OrderProgressTracker from "@/components/OrderProgressTracker";

const ORDER_STEPS = [
  { label: "Order Confirmed", date: "Wed, 11th Jan" },
  { label: "Shipped", date: "Wed, 11th Jan" },
  { label: "Out for Delivery", date: "Wed, 11th Jan" },
  { label: "Delivered", date: "Expected by, Mon 16th" },
];

export default function OrderTrackingPage() {
  const order = {
    id: "3354654654526",
    orderDate: "Feb 16, 2022",
    estimatedDelivery: "May 16, 2022",
    currentStep: 1, // index of ORDER_STEPS
    items: [
      {
        name: "One Life Graphic T-Shirt",
        image: "/images/image_7.png",
        price: 120,
        qty: 2,
        variant: "Black | Size M",
      },
      {
        name: "Slim Fit Denim Jeans",
        image: "/images/image_10.png",
        price: 180,
        qty: 1,
        variant: "Blue | Size 32",
      },
      {
        name: "Oversized Hoodie",
        image: "/images/image_8.png",
        price: 220,
        qty: 1,
        variant: "Grey | Size L",
      },
    ],
    payment: "Visa **56",
    address: {
      line1: "847 Jewess Bridge Apt.",
      city: "London, UK",
      phone: "474-769-3919",
    },
    summary: {
      subtotal: 640,
      delivery: 100,
      total: 740,
    },
  };

  return (
    <main className="max-w-[1100px] mx-auto px-4 py-10">
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: `ID ${order.id}` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
        <h1 className="text-3xl font-bold">Order ID: {order.id}</h1>

        <div className="flex gap-3">
          <Button
            text="Invoice"
            fill_background_color="bg-[#f1f0f2]"
            text_color="text-black"
            border_border=""
            border_border_radius="rounded-full"
            className="px-7 py-3 hover:cursor-pointer"
          />
          <Button
            text="Tracking"
            fill_background_color="bg-[#00000040]"
            text_color="text-black"
            border_border=""
            border_border_radius="rounded-full"
            className="px-7 py-3 hover:cursor-pointer"
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-6 text-sm mt-4 text-gray-600">
        <p>
          Order date: <strong>{order.orderDate}</strong>
        </p>
        <p className="text-green-600 font-medium">
          Estimated delivery: {order.estimatedDelivery}
        </p>
      </div>

      {/* Progress Tracker */}

      <OrderProgressTracker
        steps={ORDER_STEPS}
        currentStep={order.currentStep}
      />

      {/* Items */}
      <div className="mt-12 space-y-6 border border-2 border-[#f1f0f2] p-5 rounded-3xl">
        {order.items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-6 pb-6"
          >
            <div className="flex gap-4">
              <div className="w-[72px] h-[72px] bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={72}
                  height={72}
                  className="object-contain w-full h-full"
                />
              </div>

              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.variant}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium">${item.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sections */}
      <div className="grid md:grid-cols-2 gap-10 mt-12">
        {/* Left */}
        <div className="space-y-6 border border-2 border-[#f1f0f2] rounded-xl p-6">
          <div>
            <h3 className="font-semibold mb-2">Payment</h3>
            <p className="text-sm text-gray-600">{order.payment}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Delivery</h3>
            <p className="text-sm text-gray-600">
              {order.address.line1}
              <br />
              {order.address.city}
              <br />
              {order.address.phone}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="border border-2 border-[#f1f0f2] rounded-xl p-6 space-y-3">
          <h3 className="font-semibold mb-4">Order Summary</h3>

          <SummaryRow label="Subtotal" value={order.summary.subtotal} />
          <SummaryRow label="Delivery" value={order.summary.delivery} />

          <div className="border-t pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${order.summary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm text-gray-600">
      <span>{label}</span>
      <span>
        {value < 0 ? "-" : ""}${Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
