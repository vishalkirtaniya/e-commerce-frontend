"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RatingBar from "@/components/ui/RatingBar";
import Button from "@/components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
  isCustomizableWithImage: boolean; // true when product has "custom" tag
  images: { id: number; src: string }[];
  sizes: Size[];
  colors: { id: number; name: string; hex: string }[];
}

interface Props {
  product: Product;
}

// ── Helper: turn any error shape into a readable string ───────
function parseError(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const entries = Object.entries(err as Record<string, unknown>);
    if (entries.length > 0) {
      return entries
        .map(
          ([field, msgs]) =>
            `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : String(msgs)}`,
        )
        .join(" | ");
    }
  }
  return "Something went wrong";
}

// ── Allowed image types ────────────────────────────────────────
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

export default function ProductInfo({ product }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultSize =
    product.sizes.find((s) => s.is_default) ?? product.sizes[0];

  const [selectedSize, setSelectedSize] = useState<Size | null>(
    defaultSize ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(
    null,
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const activePrice = selectedSize?.price ?? product.price;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  // ── Image upload handler ──────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setCustomImage(file);
    setCustomImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setCustomImage(null);
    setCustomImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Add to cart ───────────────────────────────────────────────
  // If a custom image is attached, uploads it first via multipart/form-data.
  // Otherwise sends a regular JSON request.
  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/signin");
      return;
    }

    setLoading(true);
    setCartMessage(null);

    try {
      let res: Response;

      if (product.isCustomizableWithImage && customImage) {
        // ── Multipart upload when image is attached ───────────
        const formData = new FormData();
        formData.append("product_id", String(product.id));
        if (selectedSize?.id)
          formData.append("product_size_id", String(selectedSize.id));
        formData.append("quantity", String(quantity));
        if (customization.trim())
          formData.append("customization", customization.trim());
        formData.append("custom_image", customImage);

        res = await fetch(`${API_URL}/api/cart`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          // Don't set Content-Type — browser sets it with the correct boundary
          body: formData,
        });
      } else {
        // ── Standard JSON when no image ───────────────────────
        res = await fetch(`${API_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product.id,
            product_size_id: selectedSize?.id ?? undefined,
            quantity,
            customization: customization.trim() || undefined,
          }),
        });
      }

      if (res.status === 401) {
        router.push("/signin");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        const message =
          typeof data.error === "string" ? data.error : parseError(data.error);
        throw new Error(message);
      }

      setCartMessage({ type: "success", text: "Added to cart successfully!" });
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
      <h1 className="text-[32px] lg:text-[40px] font-bold leading-[34px] sm:leading-[40px] md:leading-[48px] text-text-primary font-integral mb-4">
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

      {/* Price */}
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

      {/* Size options */}
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

      {/* Customization section */}
      {product.isCustomizable && (
        <>
          <div className="mb-6 space-y-4">
            {/* Text customization */}
            <div>
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

            {/* Image upload — only shown when product has "custom" tag */}
            {product.isCustomizableWithImage && (
              <div>
                <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mb-2">
                  Upload Your Image
                  <span className="text-xs text-gray-400 ml-1">
                    (optional · JPG, PNG, WEBP · max 5MB)
                  </span>
                </p>

                {/* Preview or drop zone */}
                {customImagePreview ? (
                  <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={customImagePreview}
                      alt="Custom image preview"
                      className="w-full max-h-[200px] object-contain py-3"
                    />
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black text-white rounded-full w-7 h-7 flex items-center justify-center hover:opacity-70 transition"
                      aria-label="Remove image"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M1 1L11 11M11 1L1 11"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <p className="text-xs text-gray-400 text-center pb-2">
                      {customImage?.name}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 flex flex-col items-center gap-2 hover:border-black transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black transition">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400 group-hover:text-white transition"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 group-hover:text-black transition font-satoshi">
                      Click to upload your image
                    </p>
                    <p className="text-xs text-gray-400 font-satoshi">
                      JPG, PNG, WEBP up to 5MB
                    </p>
                  </button>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Image error */}
                {imageError && (
                  <p className="text-xs text-red-500 mt-2 font-satoshi">
                    {imageError}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="w-full h-[1px] bg-border-primary mb-6" />
        </>
      )}

      {/* Cart feedback */}
      {cartMessage && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-xl text-sm font-medium
          ${cartMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
        >
          {cartMessage.text}
        </div>
      )}

      {/* Quantity + Add to Cart + Buy Now */}
      <div className="flex w-full gap-2 sm:gap-5 items-center">
        {/* Quantity */}
        <div className="flex min-w-[110px] items-center justify-evenly bg-[#f0f0f0] rounded-full py-3 px-1">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-6 h-6 flex items-center justify-center hover:bg-white transition rounded-full"
          >
            <Image src="/icons/minus.svg" alt="-" width={12} height={12} />
          </button>

          <span className="text-base font-medium text-text-primary font-satoshi">
            {quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(1)}
            className="w-6 h-6 flex items-center justify-center hover:bg-white transition rounded-full"
          >
            <Image src="/icons/plus.svg" alt="+" width={12} height={12} />
          </button>
        </div>

        {/* Add To Cart */}
        <Button
          text={loading ? "Adding..." : "Add to Cart"}
          text_font_size="text-sm sm:text-base"
          text_font_weight="font-medium"
          text_color="text-[#ffffff]"
          fill_background_color="bg-[#000000]"
          border_border_radius="rounded-full"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-2 disabled:opacity-60"
        />

        {/* Buy Now */}
        <Button
          text="Buy Now"
          text_font_size="text-sm sm:text-base"
          text_font_weight="font-medium"
          text_color="text-[#ffffff]"
          fill_background_color="bg-[#000000]"
          border_border_radius="rounded-full"
          onClick={handleBuyNow}
          className="flex-1 py-3 px-2"
        />
      </div>
    </div>
  );
}
