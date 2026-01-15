"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "./types";
import RatingBar from "@/components/ui/RatingBar";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.id
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[0]?.toLowerCase()
  );
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + change)));
  };

  const handleAddToCart = () => {
    console.log({
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
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
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[24px] sm:text-[32px] font-bold leading-[33px] sm:leading-[44px] text-text-primary font-satoshi">
          ${product.price}
        </span>

        {product.originalPrice && (
          <span className="text-[24px] sm:text-[32px] font-bold leading-[33px] sm:leading-[44px] text-text-accent line-through font-satoshi opacity-30">
            ${product.originalPrice}
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
      <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi w-full max-w-[98%] mb-6">
        {product.description}
      </p>

      {/* Divider */}
      <div className="w-full h-[1px] bg-border-primary mb-6"></div>

      {/* Select Colors */}
      <div className="mb-6">
        <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mb-2">
          Select Colors
        </p>

        <div className="flex items-center gap-4">
          {product.colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-[36px] h-[36px] rounded-full border-2 transition-all duration-200 ${
                selectedColor === color.id
                  ? "border-text-primary scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select ${color.name}`}
            >
              {selectedColor === color.id && (
                <div className="w-full h-full flex justify-center items-center">
                  <Image
                    src="/icons/white_tick.svg"
                    alt="Selected"
                    width={36}
                    height={36}
                    className="w-1/2 h-1/2"
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-border-primary mb-6"></div>

      {/* Choose Size */}
      <div className="mb-6">
        <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mb-2">
          Choose Size
        </p>

        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => {
            const value = size.toLowerCase();
            return (
              <Button
                key={size}
                text={size}
                text_font_size="text-base"
                text_font_weight={
                  selectedSize === value
                    ? "font-medium"
                    : "font-normal"
                }
                text_color={
                  selectedSize === value
                    ? "text-[#f0f0f0]"
                    : "text-[#000000]"
                }
                fill_background_color={
                  selectedSize === value
                    ? "bg-[#000000]"
                    : "bg-[#f0f0f0]"
                }
                border_border_radius="rounded-full"
                className="px-6 py-3 border border-black"
                onClick={() => setSelectedSize(value)}
              />
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-border-primary mb-6"></div>

      {/* Quantity + Add to Cart */}
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
          text="Add to Cart"
          text_font_size="text-base"
          text_font_weight="font-medium"
          text_color="text-[#ffffff]"
          fill_background_color="bg-[#000000]"
          border_border_radius="rounded-full"
          onClick={handleAddToCart}
          className="w-1/3 sm:flex-1 px-2 py-3.5"
        />

        {/* Buy Now */}
        <Button
          text="Buy Now"
          text_font_size="text-base"
          text_font_weight="font-medium"
          text_color="text-[#ffffff]"
          fill_background_color="bg-[#000000]"
          border_border_radius="rounded-full"
          onClick={() => { router.push("/checkout"); }}
          className="w-1/3 sm:flex-1 px-2 py-3.5"
        />
      </div>
    </div>
  );
}
