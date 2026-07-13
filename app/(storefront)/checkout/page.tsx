"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import BreadCrumb from "@/components/ui/BreadCrumb";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────
interface CartSummary {
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  delivery_fee: number;
  total: number;
}

interface CartItem {
  cart_item_id: number;
  name: string;
  image: string;
  price: number;
  size_label: string | null;
  quantity: number;
}

interface FormState {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
}

// Razorpay global types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

const EMPTY_FORM: FormState = {
  email: "",
  phone: "",
  first_name: "",
  last_name: "",
  street_address: "",
  city: "",
  state: "",
  zip_code: "",
};

// ── Load Razorpay SDK on demand ────────────────────────────────
// Called right before opening the modal — guarantees the script
// is ready regardless of when the page loaded.
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Already loaded — nothing to do
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  // No razorpayReady state needed — loading is handled inside handleSubmit

  useEffect(() => {
    fetchCart();
  }, []);

  // ── Fetch cart ───────────────────────────────────────────
  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.push("/signin");
        return;
      }
      if (!res.ok) throw new Error("Failed to load cart");

      const data = await res.json();
      if (!data.items?.length) {
        router.push("/cart");
        return;
      }

      setItems(data.items);
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message ?? "Failed to load cart");
    } finally {
      setLoadingCart(false);
    }
  };

  // ── Form helpers ─────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setError(null);
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email";
    if (!form.phone) errors.phone = "Phone is required";
    if (!form.first_name) errors.first_name = "First name is required";
    if (!form.last_name) errors.last_name = "Last name is required";
    if (!form.street_address)
      errors.street_address = "Street address is required";
    if (!form.city) errors.city = "City is required";
    if (!form.state) errors.state = "State is required";
    if (!form.zip_code) errors.zip_code = "Zip code is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Main submit — 3 step flow ────────────────────────────
  // Step 1: POST /api/orders             → get order_number
  // Step 2: Load Razorpay SDK (on demand)
  // Step 3: POST /api/payments/create-order → razorpay_order_id + key_id
  // Step 4: Open Razorpay modal → on success POST /api/payments/verify
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // ── Step 1: Place order ───────────────────────────────
      const orderRes = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          payment_method: "Razorpay",
        }),
      });

      if (orderRes.status === 401) {
        router.push("/signin");
        return;
      }

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        if (typeof orderData.error === "object") {
          const backendErrors: Partial<Record<keyof FormState, string>> = {};
          Object.entries(orderData.error).forEach(([field, msgs]) => {
            backendErrors[field as keyof FormState] = Array.isArray(msgs)
              ? msgs[0]
              : String(msgs);
          });
          setFieldErrors(backendErrors);
          setSubmitting(false);
          return;
        }
        throw new Error(orderData.error ?? "Failed to place order");
      }

      const { order_number } = orderData;

      // ── Step 2: Load Razorpay SDK on demand ──────────────
      // This runs right before we need it — no race condition possible.
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded || !window.Razorpay) {
        throw new Error(
          "Could not load Razorpay. Check your internet connection and try again.",
        );
      }

      // ── Step 3: Create Razorpay order ────────────────────
      const payRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_number }),
      });

      const payData = await payRes.json();
      if (!payRes.ok)
        throw new Error(payData.error ?? "Failed to initiate payment");

      const { razorpay_order_id, amount, key_id } = payData;

      // ── Step 4: Open Razorpay checkout modal ─────────────
      const rzp = new window.Razorpay({
        key: key_id,
        amount,
        currency: "INR",
        name: "Santushti Trophy Craft",
        description: `Order ${order_number}`,
        order_id: razorpay_order_id,
        prefill: {
          name: `${form.first_name} ${form.last_name}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#000000" },

        handler: async (response: RazorpayResponse) => {
          // ── Step 5: Verify payment on backend ─────────────
          try {
            const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_number,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok)
              throw new Error(
                verifyData.error ?? "Payment verification failed",
              );

            // ── Success → redirect ────────────────────────────
            router.push(`/checkout/success?order=${order_number}`);
          } catch (err: any) {
            setError(
              err.message ??
                "Payment verification failed. Please contact support.",
            );
            setSubmitting(false);
          }
        },

        modal: {
          ondismiss: () => {
            setError(
              "Payment was cancelled. Your order has been saved — you can complete payment from your orders page.",
            );
            setSubmitting(false);
          },
        },
      });

      rzp.open();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormState) =>
    `w-full border rounded-xl px-4 py-3 text-sm font-satoshi text-text-primary placeholder:text-text-muted outline-none transition
    ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-border-primary focus:border-black"
    }`;

  return (
    // No <Script> tag needed — SDK is loaded on demand inside handleSubmit
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

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-satoshi">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT — Form ─────────────────────────────── */}
          <div className="lg:col-span-2 border border-[#00000020] rounded-2xl p-6 space-y-8">
            {/* Contact */}
            <div>
              <h2 className="font-semibold text-lg mb-4 font-satoshi">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 mt-1 font-satoshi">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass("phone")}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500 mt-1 font-satoshi">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h2 className="font-semibold text-lg mb-4 font-satoshi">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      name="first_name"
                      type="text"
                      placeholder="First Name"
                      value={form.first_name}
                      onChange={handleChange}
                      className={inputClass("first_name")}
                    />
                    {fieldErrors.first_name && (
                      <p className="text-xs text-red-500 mt-1 font-satoshi">
                        {fieldErrors.first_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="last_name"
                      type="text"
                      placeholder="Last Name"
                      value={form.last_name}
                      onChange={handleChange}
                      className={inputClass("last_name")}
                    />
                    {fieldErrors.last_name && (
                      <p className="text-xs text-red-500 mt-1 font-satoshi">
                        {fieldErrors.last_name}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    name="street_address"
                    type="text"
                    placeholder="Street Address"
                    value={form.street_address}
                    onChange={handleChange}
                    className={inputClass("street_address")}
                  />
                  {fieldErrors.street_address && (
                    <p className="text-xs text-red-500 mt-1 font-satoshi">
                      {fieldErrors.street_address}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <input
                      name="city"
                      type="text"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      className={inputClass("city")}
                    />
                    {fieldErrors.city && (
                      <p className="text-xs text-red-500 mt-1 font-satoshi">
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="state"
                      type="text"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange}
                      className={inputClass("state")}
                    />
                    {fieldErrors.state && (
                      <p className="text-xs text-red-500 mt-1 font-satoshi">
                        {fieldErrors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      name="zip_code"
                      type="text"
                      placeholder="Zip Code"
                      value={form.zip_code}
                      onChange={handleChange}
                      className={inputClass("zip_code")}
                    />
                    {fieldErrors.zip_code && (
                      <p className="text-xs text-red-500 mt-1 font-satoshi">
                        {fieldErrors.zip_code}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button
              text={submitting ? "Processing..." : "Proceed to Payment"}
              fill_background_color="bg-black"
              text_color="text-white"
              border_border_radius="rounded-full"
              className="w-full py-3"
              onClick={handleSubmit}
            />
          </div>

          {/* ── RIGHT — Summary ──────────────────────────── */}
          <div className="border border-[#00000020] rounded-2xl p-6 h-fit">
            <h2 className="font-semibold text-lg mb-6 font-satoshi">
              Order Summary
            </h2>

            {/* Items preview */}
            {loadingCart ? (
              <div className="space-y-3 mb-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image ?? "/images/placeholder.png"}
                        alt={item.name}
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
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-400 font-satoshi">
                        ×{item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="h-px bg-border-primary mb-4" />

            {loadingCart ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : summary ? (
              <div className="space-y-3 text-sm font-satoshi">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium">
                    ₹{summary.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {summary.discount_amount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount ({summary.discount_percent}%)</span>
                    <span>
                      −₹{summary.discount_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-muted">Delivery</span>
                  <span className="font-medium">
                    {summary.delivery_fee === 0
                      ? "Free"
                      : `₹${summary.delivery_fee.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="h-px bg-border-primary" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{summary.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ) : null}

            {/* Razorpay badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-satoshi">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secured by Razorpay
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}
