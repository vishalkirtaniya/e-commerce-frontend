"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────
type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

interface Order {
  order_number: string;
  date: string;
  estimated_delivery: string;
  total: number;
  status: OrderStatus;
  first_item_name: string;
  first_item_image: string;
  item_count: number;
}

// ── Status badge styles ───────────────────────────────────────
const statusStyles: Record<OrderStatus, string> = {
  PLACED: "bg-gray-100 text-gray-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-yellow-100 text-yellow-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
};

// ── Skeleton ──────────────────────────────────────────────────
function OrderSkeleton() {
  return (
    <div className="border border-[#00000040] rounded-2xl p-6 bg-white animate-pulse">
      <div className="flex justify-between mb-5">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-gray-100 rounded" />
          <div className="h-4 w-28 bg-gray-100 rounded" />
        </div>
        <div className="flex gap-3 items-center">
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
          <div className="h-5 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="flex gap-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="w-16 h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push("/signin");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch orders");

      const json: { data: any[] } = await res.json();

      const mapped: Order[] = json.data.map((o) => ({
        order_number: o.order_number,
        date: new Date(o.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        estimated_delivery: o.estimated_delivery
          ? new Date(o.estimated_delivery).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "TBD",
        total: parseFloat(o.total),
        status: o.status as OrderStatus,
        item_count: parseInt(o.item_count, 10),
        first_item_name: o.first_item_name ?? "Order Item",
        first_item_image: o.first_item_image ?? "/images/placeholder.png",
      }));

      setOrders(mapped);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1100px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-gray-600">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">
            Looks like you haven't placed any orders yet.
          </p>
          <Link
            href="/shop"
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Orders list */}
      {!loading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_number}
              className="border border-[#00000040] rounded-2xl p-6 bg-white hover:shadow-sm transition"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                  <p className="font-semibold text-lg">
                    Order ID: {order.order_number}
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
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Items preview */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-4">
                  <div className="flex gap-2">
                    {/* First item thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={order.first_item_image}
                        alt={order.first_item_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Overflow count */}
                    {order.item_count > 1 && (
                      <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        +{order.item_count - 1}
                      </div>
                    )}
                  </div>

                  {/* Name + delivery */}
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">{order.first_item_name}</p>
                    {order.item_count > 1 && (
                      <p className="text-gray-500">
                        +{order.item_count - 1} more item
                        {order.item_count > 2 ? "s" : ""}
                      </p>
                    )}
                    <p className="text-xs text-green-600 mt-1">
                      Expected delivery: {order.estimated_delivery}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2">
                  <Link
                    href={`/orders/${order.order_number}`}
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
      )}
    </main>
  );
}
