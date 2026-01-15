// components/FiltersSidebar.jsx
"use client";

import Image from "next/image";
import { useState } from "react";

export default function FiltersSidebar() {
  const [selectedSize, setSelectedSize] = useState("Large");

  return (
    <aside className="w-full border border-[#f1f0f2] rounded-2xl p-5 space-y-1 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Image
          src="/icons/filter.svg"
          alt="Filters"
          width={18}
          height={18}
        />
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Categories */}
      <div className="space-y-2">
        {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map(
          (item) => (
            <button
              key={item}
              className="w-full flex items-center justify-between text-sm text-text-muted hover:text-text-primary"
            >
              <span>{item}</span>
              <span className="text-xl leading-none">›</span>
            </button>
          )
        )}
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Price</h3>
          <span className="text-lg">⌃</span>
        </div>

        <input
          type="range"
          min="50"
          max="200"
          className="w-full accent-black"
        />

        <div className="flex justify-between text-sm mt-2">
          <span>$50</span>
          <span>$200</span>
        </div>
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Colors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Colors</h3>
          <span className="text-lg">⌃</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            "#22c55e",
            "#ef4444",
            "#eab308",
            "#f97316",
            "#06b6d4",
            "#2563eb",
          ].map((color, index) => (
            <button
              key={index}
              className={`w-7 h-7 rounded-full border flex items-center justify-center`}
              style={{ backgroundColor: color }}
            >
              {color === "#2563eb" && (
                <Image
                  src="/icons/white_tick.svg"
                  alt="selected"
                  width={14}
                  height={14}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Size */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Size</h3>
          <span className="text-lg">⌃</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {[
            "XX-Small",
            "X-Small",
            "Small",
            "Medium",
            "Large",
            "X-Large",
            "XX-Large",
          ].map((size) => {
            const active = size === selectedSize;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-2 rounded-full text-xs transition ${
                  active
                    ? "bg-black text-white"
                    : "bg-gray-100 text-text-muted hover:bg-gray-200"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Dress Style */}
      <div className="space-y-2">
        <h3 className="font-medium mb-2">Dress Style</h3>
        {["Casual", "Formal", "Party", "Gym"].map((item) => (
          <button
            key={item}
            className="w-full flex items-center justify-between text-xs text-text-muted hover:text-text-primary"
          >
            <span>{item}</span>
            <span className="text-xl leading-none">›</span>
          </button>
        ))}
      </div>

      {/* Apply */}
      <button className="w-full bg-black text-white py-3 rounded-full text-xs font-medium mt-4">
        Apply Filter
      </button>
    </aside>
  );
}
