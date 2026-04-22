"use client";

import Image from "next/image";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import OrderProgressTracker from "@/components/OrderProgressTracker";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Types (matching exact API response from orders.service.ts) ─
interface OrderItem {
  id: number;
  name: string;
  image: string | null;
  price: string; // comes as string from DB
  variant: string | null; // size_label
  quantity: number;
  customization: string | null;
}

interface OrderStep {
  status: string;
  label: string;
  date: string;
}

interface OrderData {
  id: number;
  order_number: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  email: string;
  phone: string;
  estimated_delivery: string;
  created_at: string;
  // Address fields (from LEFT JOIN addresses)
  first_name: string | null;
  last_name: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  delivery_phone: string | null;
  // Computed
  items: OrderItem[];
  steps: OrderStep[];
  current_step: number;
}

// ── Auth helper ───────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── API call ──────────────────────────────────────────────────
async function fetchOrder(orderNumber: string): Promise<OrderData> {
  const res = await fetch(`${BASE_URL}/api/orders/${orderNumber}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

// ── Helpers ───────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Component ─────────────────────────────────────────────────
export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params?.pageId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/signin");
      return;
    }
    if (!orderNumber) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrder(orderNumber);
        setOrder(data);
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderNumber, router]);

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="max-w-[1100px] mx-auto px-4 py-10">
        <p className="text-center text-gray-500 py-20">Loading order…</p>
      </main>
    );
  }

  // ── Error ────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <main className="max-w-[1100px] mx-auto px-4 py-10">
        <p className="text-center text-red-500 py-20">
          {error ?? "Order not found"}
        </p>
      </main>
    );
  }

  // Build steps for the progress tracker — use history if available,
  // otherwise fall back to the static STATUS_STEPS config
  const trackerSteps =
    order.steps.length > 0
      ? order.steps.map((s) => ({
          label: s.label,
          date: formatDate(s.date),
        }))
      : [
          { label: "Order Placed", date: "" },
          { label: "Order Confirmed", date: "" },
          { label: "Packed", date: "" },
          { label: "Shipped", date: "" },
          { label: "Out for Delivery", date: "" },
          { label: "Delivered", date: "" },
        ];

  const addressLine = [
    order.first_name && order.last_name
      ? `${order.first_name} ${order.last_name}`
      : null,
    order.street_address,
    [order.city, order.state, order.zip_code].filter(Boolean).join(", "),
    order.delivery_phone,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <main className="max-w-[1100px] mx-auto px-4 py-10">
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: `ID ${order.order_number}` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
        <h1 className="text-3xl font-bold">Order ID: {order.order_number}</h1>

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
          Order date: <strong>{formatDate(order.created_at)}</strong>
        </p>
        <p className="text-green-600 font-medium">
          Estimated delivery: {formatDate(order.estimated_delivery)}
        </p>
      </div>

      {/* Progress Tracker */}
      <OrderProgressTracker
        steps={trackerSteps}
        currentStep={order.current_step}
      />

      {/* Items */}
      <div className="mt-12 space-y-6 border border-2 border-[#f1f0f2] p-5 rounded-3xl">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-6 pb-6"
          >
            <div className="flex gap-4">
              <div className="w-[72px] h-[72px] bg-gray-100 rounded-xl overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={72}
                    height={72}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>

              <div>
                <p className="font-medium">{item.name}</p>
                {item.variant && (
                  <p className="text-sm text-gray-500">{item.variant}</p>
                )}
                {item.customization && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Note: {item.customization}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium">
                ₹{parseFloat(item.price).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sections */}
      <div className="grid md:grid-cols-2 gap-10 mt-12">
        {/* Left — Payment & Delivery */}
        <div className="space-y-6 border border-2 border-[#f1f0f2] rounded-xl p-6">
          <div>
            <h3 className="font-semibold mb-2">Payment</h3>
            <p className="text-sm text-gray-600 capitalize">
              {order.payment_method.replace(/_/g, " ")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Delivery</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {addressLine || "No address on record"}
            </p>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="border border-2 border-[#f1f0f2] rounded-xl p-6 space-y-3">
          <h3 className="font-semibold mb-4">Order Summary</h3>

          <SummaryRow label="Subtotal" value={Number(order.subtotal)} />
          <SummaryRow label="Discount" value={-Number(order.discount_amount)} />
          <SummaryRow label="Delivery Fee" value={Number(order.delivery_fee)} />

          <div className="border-t pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{Number(order.total).toFixed(2)}</span>
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
        {value < 0 ? "-" : ""}₹{Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
