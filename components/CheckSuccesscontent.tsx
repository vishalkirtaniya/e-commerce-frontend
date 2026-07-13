"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface OrderDetail {
  order_number: string;
  total: number;
  estimated_delivery: string;
  status: string;
  items: {
    name: string;
    image_url: string;
    price: number;
    quantity: number;
    size_label: string | null;
  }[];
}

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      router.push("/");
      return;
    }

    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/${orderNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Order not found");

      const data = await res.json();
      setOrder(data);
    } catch (error) {
      console.error(error);
      // Payment succeeded even if order fetch fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-secondary-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[600px] mx-auto">
        <div className="bg-white rounded-[20px] border border-border-primary p-8 sm:p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-[28px] sm:text-[32px] font-bold text-text-primary font-integral mb-2">
            Order Confirmed!
          </h1>

          <p className="text-text-muted font-satoshi text-base mb-2">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>

          {orderNumber && (
            <p className="text-sm font-satoshi text-gray-400 mb-8">
              Order ID:{" "}
              <span className="text-text-primary font-medium">
                {orderNumber}
              </span>
            </p>
          )}

          <div className="h-px bg-border-primary mb-6" />

          {loading ? (
            <div className="space-y-3 mb-6 animate-pulse">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 text-left">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : order ? (
            <>
              <div className="space-y-3 mb-6 text-left">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image_url || "/images/placeholder.png"}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-satoshi truncate">
                        {item.name}
                      </p>

                      {item.size_label && (
                        <p className="text-xs text-gray-400 font-satoshi">
                          {item.size_label}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium font-satoshi">
                        ₹
                        {(
                          item.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>

                      <p className="text-xs text-gray-400 font-satoshi">
                        ×{item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border-primary mb-4" />

              <div className="flex justify-between text-sm font-satoshi mb-1">
                <span className="text-text-muted">Total Paid</span>

                <span className="font-bold text-base">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </span>
              </div>

              {order.estimated_delivery && (
                <div className="flex justify-between text-sm font-satoshi">
                  <span className="text-text-muted">
                    Estimated Delivery
                  </span>

                  <span className="text-green-600 font-medium">
                    {new Date(
                      order.estimated_delivery
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </>
          ) : null}

          <div className="h-px bg-border-primary my-6" />

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/orders/${orderNumber}`}
              className="flex-1 bg-black text-white font-satoshi font-medium text-sm py-3.5 rounded-full text-center hover:opacity-80 transition"
            >
              Track Order
            </Link>

            <Link
              href="/shop"
              className="flex-1 border border-border-primary text-text-primary font-satoshi font-medium text-sm py-3.5 rounded-full text-center hover:bg-[#f0f0f0] transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-8 opacity-30">
          <Image
            src="/icons/star.svg"
            alt="star"
            width={32}
            height={32}
          />
        </div>
      </div>
    </main>
  );
}