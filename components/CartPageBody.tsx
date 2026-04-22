"use client";

import Image from "next/image";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Types (matching exact API response shape) ─────────────────
interface CartItem {
  cart_item_id: number;
  quantity: number;
  customization: string | null;
  product_id: number;
  slug: string;
  name: string;
  material: string;
  is_customizable: boolean;
  size_id: number | null;
  size_label: string | null;
  price: string; // API returns price as string e.g. "549.00"
  image: string | null;
}

interface CartSummary {
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  delivery_fee: number;
  total: number;
}

interface CartData {
  cart_id: number;
  items: CartItem[];
  summary: CartSummary;
  promoCode?: string | null;
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

// ── API calls ─────────────────────────────────────────────────
async function fetchCart(): Promise<CartData> {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

async function updateItemQty(
  cartItemId: number,
  quantity: number,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/cart/${cartItemId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update item");
}

async function removeItem(cartItemId: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/cart/${cartItemId}`, {
    method: "DELETE",
    // No Content-Type here — DELETE has no body and Fastify rejects
    // 'application/json' with an empty body (FST_ERR_CTP_EMPTY_JSON_BODY)
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to remove item");
}

async function applyPromoCode(code: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/cart/promo`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Invalid promo code");
}

// ── Component ─────────────────────────────────────────────────
export default function CartPageBody() {
  const router = useRouter();

  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  // ── Fetch cart on mount ──────────────────────────────────────
  const loadCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/signin");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCart();
      setCart(data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ── Quantity update ──────────────────────────────────────────
  const handleQuantityChange = async (cartItemId: number, delta: number) => {
    if (!cart) return;
    const item = cart.items.find((i) => i.cart_item_id === cartItemId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    // Optimistic update
    setCart((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((i) =>
              i.cart_item_id === cartItemId ? { ...i, quantity: newQty } : i,
            ),
          }
        : prev,
    );

    setUpdatingIds((prev) => new Set(prev).add(cartItemId));
    try {
      await updateItemQty(cartItemId, newQty);
      const updated = await fetchCart();
      setCart(updated);
    } catch {
      // Rollback on failure
      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.cart_item_id === cartItemId
                  ? { ...i, quantity: item.quantity }
                  : i,
              ),
            }
          : prev,
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
    }
  };

  // ── Remove item ──────────────────────────────────────────────
  const handleRemove = async (cartItemId: number) => {
    if (!cart) return;

    const previousItems = cart.items;

    // Optimistic update
    setCart((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.filter((i) => i.cart_item_id !== cartItemId),
          }
        : prev,
    );

    setUpdatingIds((prev) => new Set(prev).add(cartItemId));
    try {
      await removeItem(cartItemId);
      const updated = await fetchCart();
      setCart(updated);
    } catch {
      // Rollback
      setCart((prev) => (prev ? { ...prev, items: previousItems } : prev));
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
    }
  };

  // ── Apply promo ──────────────────────────────────────────────
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoError(null);
    setPromoLoading(true);
    try {
      await applyPromoCode(promoInput.trim());
      const updated = await fetchCart();
      setCart(updated);
      setPromoInput("");
    } catch (err: any) {
      setPromoError(err.message ?? "Invalid promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  // ── Loading / Error states ───────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-10">
        <p className="text-center text-gray-500 py-20">Loading cart…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-10">
        <p className="text-center text-red-500 py-20">{error}</p>
      </div>
    );
  }

  // Derived display values from nested summary object
  const items = cart?.items ?? [];
  const subtotal = cart?.summary?.subtotal ?? 0;
  const discountPercent = cart?.summary?.discount_percent ?? 0;
  const discountAmount = cart?.summary?.discount_amount ?? 0;
  const deliveryFee = cart?.summary?.delivery_fee ?? 0;
  const total = cart?.summary?.total ?? 0;

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="max-w-[1240px] mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <BreadCrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

      {/* Title */}
      <h1 className="text-[32px] font-bold font-integral mt-6 mb-10">
        Your Cart
      </h1>

      {/* Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 border border-1 border-[#00000040] rounded-2xl p-6 space-y-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              Your cart is empty.
            </p>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className={`flex items-center justify-between gap-4 border-b border-[#00000040] last:border-b-0 pb-6 last:pb-0 transition-opacity ${
                    updatingIds.has(item.cart_item_id)
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div className="w-[80px] h-[80px] bg-gray-100 rounded-xl overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        // Placeholder when image is null
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.size_label && (
                        <p className="text-sm text-text-muted">
                          Size: {item.size_label}
                        </p>
                      )}
                      <p className="text-sm text-text-muted">
                        Material: {item.material}
                      </p>
                      <p className="font-semibold mt-1">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4">
                    {/* Quantity */}
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <button
                        className="px-2"
                        onClick={() =>
                          handleQuantityChange(item.cart_item_id, -1)
                        }
                      >
                        −
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        className="px-2"
                        onClick={() =>
                          handleQuantityChange(item.cart_item_id, 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}
                    <button onClick={() => handleRemove(item.cart_item_id)}>
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
            </>
          )}
        </div>

        {/* Order Summary */}
        <div className="border border-1 border-[#00000040] rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-red-500">
              <span>Discount (-{discountPercent}%)</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>

            <div className="border-t border-[#00000040] pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="flex gap-2 mt-6">
            <input
              type="text"
              placeholder="Add promo code"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoError(null);
              }}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            />
            <Button
              text={promoLoading ? "Applying…" : "Apply"}
              fill_background_color="bg-black"
              text_color="text-white"
              border_border_radius="rounded-full"
              className="px-6"
              onClick={handleApplyPromo}
            />
          </div>
          {promoError && (
            <p className="text-red-500 text-xs mt-2 pl-2">{promoError}</p>
          )}
          {cart?.promoCode && !promoError && (
            <p className="text-green-600 text-xs mt-2 pl-2">
              Promo &quot;{cart.promoCode}&quot; applied!
            </p>
          )}

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
