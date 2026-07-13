"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

interface CartItem {
  cart_item_id: number;
  quantity: number;
  name: string;
  price: string;
  image: string | null;
  size_label: string | null;
}

interface CartSummary {
  total: number;
  subtotal: number;
}
interface CartData {
  items: CartItem[];
  summary: CartSummary;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuthed(!!getToken());
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setCart(await res.json());
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    if (open) fetchCart();
  }, [open, fetchCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!mounted ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">Loading…</p>
            </div>
          ) : !isAuthed ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#999"
                  strokeWidth="1.5"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-base">
                  Sign in to view your cart
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Items you add will be saved here.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  router.push("/signin");
                }}
                className="w-full py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-black/80 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">Loading…</p>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <p className="text-gray-400">Your cart is empty.</p>
              <button
                onClick={() => {
                  onClose();
                  router.push("/shop");
                }}
                className="px-6 py-2 bg-black text-white rounded-full text-sm"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex gap-4 items-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {item.name}
                    </p>
                    {item.size_label && (
                      <p className="text-xs text-gray-400">
                        Size: {item.size_label}
                      </p>
                    )}
                    <p className="text-sm font-medium mt-0.5">
                      ₹{parseFloat(item.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 flex-shrink-0">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {mounted && isAuthed && cart && cart.items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">
                ₹{cart.summary.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                router.push("/cart");
              }}
              className="w-full py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-black/80 transition-colors"
            >
              View Full Cart →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
