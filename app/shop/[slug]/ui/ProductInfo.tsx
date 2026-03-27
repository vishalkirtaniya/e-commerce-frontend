"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RatingBar from "@/components/ui/RatingBar";
import Button from "@/components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ── Types ─────────────────────────────────────────────────────
interface Size {
  id: number;
  label: string;
  price: number;
  is_default: boolean;
}

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  material: string;
  isCustomizable: boolean;
  images: { id: number; src: string }[];
  sizes: Size[];
  colors: { id: number; name: string; hex: string }[];
}

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  const router = useRouter();

  // Default to the is_default size, fall back to first
  const defaultSize =
    product.sizes.find((s) => s.is_default) ?? product.sizes[0];

  const [selectedSize, setSelectedSize] = useState<Size | null>(
    defaultSize ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Active price — use selected size price if available, else base price
  const activePrice = selectedSize?.price ?? product.price;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    setLoading(true);
    setCartMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          product_size_id: selectedSize?.id ?? null,
          quantity,
          customization: customization.trim() || undefined,
        }),
      });

      if (res.status === 401) {
        router.push("/signin");
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to add to cart");
      }

      setCartMessage({ type: "success", text: "Added to cart successfully!" });

      // Clear message after 3s
      setTimeout(() => setCartMessage(null), 3000);
    } catch (err: any) {
      setCartMessage({
        type: "error",
        text: err.message ?? "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[34px] sm:leading-[40px] md:leading-[48px] text-text-primary font-integral mb-4">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-4 mb-[10px]">
        <RatingBar rating={product.rating} />
        <span className="text-base font-normal leading-[22px] text-text-primary font-satoshi">
          <span>{product.rating}/</span>
          <span className="text-text-muted">5</span>
        </span>
        <span className="text-sm text-text-muted">
          ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price — updates when size changes */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[24px] sm:text-[32px] font-bold leading-[33px] sm:leading-[44px] text-text-primary font-satoshi">
          ₹{activePrice.toLocaleString("en-IN")}
        </span>

        {product.originalPrice && (
          <span className="text-[24px] sm:text-[32px] font-bold leading-[33px] sm:leading-[44px] text-text-accent line-through font-satoshi opacity-30">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
        )}

        {product.discount && (
          <Button
            text={`-${product.discount}%`}
            text_font_size="text-base"
            text_font_weight="font-medium"
            text_color="text-[#FF3333]"
            fill_background_color="bg-[#f0f0f0]"
            border_border_radius="rounded-full"
            className="ml-2 px-4 py-2"
          />
        )}
      </div>

      {/* Description */}
      <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi w-full max-w-[98%] mb-4">
        {product.description}
      </p>

      {/* Material badge */}
      <span className="inline-block text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-6">
        Material: {product.material}
      </span>

      <div className="w-full h-[1px] bg-border-primary mb-6" />

      {/* Size options — from DB, each with its own price */}
      {product.sizes.length > 0 && (
        <>
          <div className="mb-6">
            <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mb-3">
              Choose Size
              {selectedSize && (
                <span className="ml-2 text-black font-medium">
                  — {selectedSize.label}
                </span>
              )}
            </p>

            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => {
                const active = selectedSize?.id === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium border transition
                      ${
                        active
                          ? "bg-black text-white border-black"
                          : "bg-[#f0f0f0] text-black border-transparent hover:border-black"
                      }`}
                  >
                    {size.label}
                    <span
                      className={`ml-1.5 text-xs ${active ? "text-gray-300" : "text-gray-400"}`}
                    >
                      ₹{size.price.toLocaleString("en-IN")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full h-[1px] bg-border-primary mb-6" />
        </>
      )}

      {/* Customization note — only for customizable products */}
      {product.isCustomizable && (
        <>
          <div className="mb-6">
            <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mb-2">
              Customization Details
              <span className="text-xs text-gray-400 ml-1">(optional)</span>
            </p>
            <textarea
              value={customization}
              onChange={(e) => setCustomization(e.target.value)}
              placeholder="e.g. Name: Rahul & Priya, Date: 22-06-2024, Photo: will upload separately"
              rows={3}
              maxLength={500}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-black transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {customization.length}/500
            </p>
          </div>

          <div className="w-full h-[1px] bg-border-primary mb-6" />
        </>
      )}

      {/* Cart feedback message */}
      {cartMessage && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-xl text-sm font-medium
          ${
            cartMessage.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {cartMessage.text}
        </div>
      )}

      {/* Quantity + Add to Cart + Buy Now */}
      <div className="flex w-full flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center">
        {/* Quantity */}
        <div className="flex w-1/3 items-center justify-evenly bg-[#f0f0f0] rounded-[26px] px-1 py-3.5 sm:w-[30%]">
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-6 h-6 flex items-center justify-center hover:bg-white transition rounded-full"
          >
            <Image src="/icons/minus.svg" alt="-" width={12} height={12} />
          </button>

          <span className="text-base font-medium text-text-primary font-satoshi">
            {quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-6 h-6 flex items-center justify-center hover:bg-white transition rounded-full"
          >
            <Image src="/icons/plus.svg" alt="+" width={12} height={12} />
          </button>
        </div>

        {/* Add to Cart */}
        <Button
          text={loading ? "Adding..." : "Add to Cart"}
          text_font_size="text-base"
          text_font_weight="font-medium"
          text_color="text-[#ffffff]"
          fill_background_color="bg-[#000000]"
          border_border_radius="rounded-full"
          onClick={handleAddToCart}
          className="w-1/3 sm:flex-1 px-2 py-3.5 disabled:opacity-60"
        />

        {/* Buy Now */}
        <Button
          text="Buy Now"
          text_font_size="text-base"
          text_font_weight="font-medium"
          text_color="text-[#ffffff]"
          fill_background_color="bg-[#000000]"
          border_border_radius="rounded-full"
          onClick={handleBuyNow}
          className="w-1/3 sm:flex-1 px-2 py-3.5"
        />
      </div>
    </div>
  );
}
