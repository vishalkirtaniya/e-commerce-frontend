"use client";

import Image from "next/image";
import Link from "next/link";

type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

interface OrderItem {
  id: string;
  name: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  expectedDelivery: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

const ORDERS: Order[] = [
  {
    id: "ORD123456",
    date: "20 Jan 2026",
    expectedDelivery: "25 Jan 2026",
    total: 467,
    status: "SHIPPED",
    items: [
      {
        id: "1",
        name: "Gradient Graphic T-shirt",
        image: "/images/image_7.png",
      },
      {
        id: "2",
        name: "Checked Shirt",
        image: "/images/image_9.png",
      },
    ],
  },
  {
    id: "ORD123457",
    date: "15 Jan 2026",
    expectedDelivery: "18 Jan 2026",
    total: 212,
    status: "DELIVERED",
    items: [
      {
        id: "3",
        name: "Polo with Contrast Trims",
        image: "/images/image_7.png",
      },
    ],
  },
  {
    id: "ORD123458",
    date: "10 Jan 2026",
    expectedDelivery: "16 Jan 2026",
    total: 145,
    status: "OUT_FOR_DELIVERY",
    items: [
      {
        id: "4",
        name: "Skinny Fit Jeans",
        image: "/images/image_10.png",
      },
      {
        id: "5",
        name: "Loose Fit Shorts",
        image: "/images/image_8.png",
      },
      {
        id: "6",
        name: "Graphic Tee",
        image: "/images/image_6.png",
      },
    ],
  },
];

const statusStyles: Record<OrderStatus, string> = {
  PLACED: "bg-gray-100 text-gray-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-yellow-100 text-yellow-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
};

export default function OrdersPage() {
  return (
    <main className="max-w-[1100px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {ORDERS.map((order) => (
          <div
            key={order.id}
            className="border border-[#00000040] rounded-2xl p-6 bg-white hover:shadow-sm transition"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <p className="font-semibold text-lg">
                  Order ID: {order.id}
                </p>
                <p className="text-sm text-gray-500">
                  Ordered on {order.date}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}
                >
                  {order.status.replaceAll("_", " ")}
                </span>

                <p className="font-semibold text-lg">
                  ${order.total}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex gap-4">
                {/* Images */}
                <div className="flex gap-2">
                  {order.items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}

                  {order.items.length > 4 && (
                    <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* Product Names */}
                <div className="text-sm text-gray-700">
                  <p className="font-medium">
                    {order.items[0].name}
                  </p>
                  {order.items.length > 1 && (
                    <p className="text-gray-500">
                      +{order.items.length - 1} more item
                      {order.items.length > 2 ? "s" : ""}
                    </p>
                  )}

                  <p className="text-xs text-green-600 mt-1">
                    Expected delivery: {order.expectedDelivery}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-sm font-medium underline hover:opacity-70"
                >
                  View Details →
                </Link>

                <button className="text-sm text-gray-500 hover:text-black transition">
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
