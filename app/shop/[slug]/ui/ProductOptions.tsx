"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Product } from "./types";

export default function ProductOptions({
  product,
}: {
  product: Product;
}) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.id
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[0]
  );
  const [quantity, setQuantity] = useState(1);

  const changeQuantity = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(10, q + delta)));
  };

  const handleAddToCart = () => {
    console.log({
      productId: product.id,
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Colors */}
      <div>
        <p className="text-sm text-text-muted mb-2">Select Colors</p>
        <div className="flex gap-3">
          {product.colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-9 h-9 rounded-full border-2 transition ${
                selectedColor === color.id
                  ? "border-black scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-sm text-text-muted mb-2">Choose Size</p>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <Button
              key={size}
              text={size}
              onClick={() => setSelectedSize(size)}
              text_color={
                selectedSize === size
                  ? "text-white"
                  : "text-black"
              }
              fill_background_color={
                selectedSize === size
                  ? "bg-black"
                  : "bg-gray-100"
              }
              border_border_radius="rounded-full"
              className="px-5 py-2"
            />
          ))}
        </div>
      </div>

      {/* Quantity & Cart */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center bg-gray-100 rounded-full px-3">
          <button
            onClick={() => changeQuantity(-1)}
            className="px-2"
          >
            −
          </button>
          <span className="px-3">{quantity}</span>
          <button
            onClick={() => changeQuantity(1)}
            className="px-2"
          >
            +
          </button>
        </div>

        <Button
          text="Add to Cart"
          onClick={handleAddToCart}
          text_color="text-white"
          fill_background_color="bg-black"
          border_border_radius="rounded-full"
          className="flex-1 py-3"
        />
      </div>
    </div>
  );
}
