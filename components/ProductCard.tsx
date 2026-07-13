"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export interface Product {
  images: string[];
  name: string;
  slug: string;
  rating: string;
  price: number;
  originalPrice?: number;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleMouseEnter() {
    if (product.images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % product.images.length);
    }, 1200);
  }

  function handleMouseLeave() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentIndex(0);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const currentImage =
    product.images[currentIndex] ?? "/images/placeholder.png";

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="block space-y-2 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image container */}
      <div className="bg-gray-100 rounded-xl overflow-hidden relative">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-contain transition-opacity duration-300"
        />

        {/* Dot indicators — only show if more than 1 image */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {product.images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-black scale-125" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium group-hover:underline">
        {product.name}
      </h3>

      <div className="text-sm text-yellow-500">
        ★★★★★ <span className="text-gray-400">{product.rating}</span>
      </div>

      <div className="flex items-center gap-[2px] text-sm">
        <span className="font-semibold">₹{product.price}</span>
        {product.originalPrice && (
          <span className="line-through text-gray-400">
            {product.originalPrice}
          </span>
        )}
        {product.discount && (
          <span className="text-red-500 text-[8px]">-{product.discount}%</span>
        )}
      </div>
    </Link>
  );
}
