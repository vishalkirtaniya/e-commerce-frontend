"use client";

import Image from "next/image";
import { useState } from "react";
import type { FilterOptions, ActiveFilters } from "@/app/(storefront)/shop/page";

interface Props {
  filterOptions: FilterOptions | null;
  activeFilters: ActiveFilters;
  loading: boolean;
  onFilterChange: (updated: Partial<ActiveFilters>) => void;
  onReset: () => void;
  onApply?: () => void;
}

export default function FiltersSidebar({
  filterOptions,
  activeFilters,
  loading,
  onFilterChange,
  onReset,
  onApply,
}: Props) {
  const [priceRange, setPriceRange] = useState({
    min: activeFilters.min_price,
    max: activeFilters.max_price,
  });

  const handleApply = () => {
    onFilterChange({
      min_price: priceRange.min,
      max_price: priceRange.max,
    });

    onApply?.();
  };

  if (loading) {
    return (
      <aside className="w-full border border-[#f1f0f2] rounded-2xl p-5 bg-white space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-100 rounded" />
        ))}
      </aside>
    );
  }

  return (
    <aside className="w-full border border-[#f1f0f2] rounded-2xl p-5 space-y-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-black transition"
          >
            Reset
          </button>
          <Image src="/icons/filter.svg" alt="Filters" width={18} height={18} />
        </div>
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Categories */}
      <div className="space-y-1">
        <h3 className="font-medium mb-2">Category</h3>
        {/* All option */}
        <button
          onClick={() => onFilterChange({ category: "" })}
          className={`w-full flex items-center justify-between text-sm transition
            ${
              !activeFilters.category
                ? "text-black font-medium"
                : "text-text-muted hover:text-black"
            }`}
        >
          <span>All</span>
          <span className="text-xl leading-none">›</span>
        </button>

        {filterOptions?.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              onFilterChange({
                category: activeFilters.category === cat.slug ? "" : cat.slug,
              })
            }
            className={`w-full flex items-center justify-between text-sm transition
              ${
                activeFilters.category === cat.slug
                  ? "text-black font-medium"
                  : "text-text-muted hover:text-black"
              }`}
          >
            <span>{cat.name}</span>
            <span className="text-xl leading-none">›</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Occasions */}
      <div className="space-y-1">
        <h3 className="font-medium mb-2">Occasion</h3>
        <button
          onClick={() => onFilterChange({ occasion: "" })}
          className={`w-full flex items-center justify-between text-sm transition
            ${
              !activeFilters.occasion
                ? "text-black font-medium"
                : "text-text-muted hover:text-black"
            }`}
        >
          <span>All</span>
          <span className="text-xl leading-none">›</span>
        </button>

        {filterOptions?.occasions.map((occ) => (
          <button
            key={occ.id}
            onClick={() =>
              onFilterChange({
                occasion: activeFilters.occasion === occ.slug ? "" : occ.slug,
              })
            }
            className={`w-full flex items-center justify-between text-sm transition
              ${
                activeFilters.occasion === occ.slug
                  ? "text-black font-medium"
                  : "text-text-muted hover:text-black"
              }`}
          >
            <span>{occ.name}</span>
            <span className="text-xl leading-none">›</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Material */}
      <div className="space-y-1">
        <h3 className="font-medium mb-2">Material</h3>
        <div className="flex flex-wrap gap-1">
          {filterOptions?.materials.map((mat) => {
            const active = activeFilters.material === mat;
            return (
              <button
                key={mat}
                onClick={() =>
                  onFilterChange({
                    material: active ? "" : mat,
                  })
                }
                className={`px-3 py-2 rounded-full text-xs transition
                  ${
                    active
                      ? "bg-black text-white"
                      : "bg-gray-100 text-text-muted hover:bg-gray-200"
                  }`}
              >
                {mat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-[#f1f0f2]" />

      {/* Price range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Price</h3>
          <span className="text-xs text-gray-400">
            ₹{priceRange.min} – ₹{priceRange.max}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 w-6">Min</label>
            <input
              type="range"
              min={filterOptions?.price_range.min ?? 0}
              max={filterOptions?.price_range.max ?? 10000}
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange((prev) => ({
                  ...prev,
                  min: Math.min(Number(e.target.value), prev.max - 1),
                }))
              }
              className="w-full accent-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 w-6">Max</label>
            <input
              type="range"
              min={filterOptions?.price_range.min ?? 0}
              max={filterOptions?.price_range.max ?? 10000}
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange((prev) => ({
                  ...prev,
                  max: Math.max(Number(e.target.value), prev.min + 1),
                }))
              }
              className="w-full accent-black"
            />
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹{filterOptions?.price_range.min ?? 0}</span>
            <span>₹{filterOptions?.price_range.max ?? 10000}</span>
          </div>
        </div>
      </div>

      {/* Apply button */}
      <button
        onClick={handleApply}
        className="w-full bg-black text-white py-3 rounded-full text-xs font-medium mt-2 hover:opacity-80 transition"
      >
        Apply Filter
      </button>
    </aside>
  );
}
