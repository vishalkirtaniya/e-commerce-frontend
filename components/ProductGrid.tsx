"use client";

import ProductCard from "./ProductCard";
import { PaginationMeta, ApiProduct } from "@/app/shop/page";

interface Props {
  products: ApiProduct[];
  meta: PaginationMeta | null;
  loading: boolean;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Most Popular" },
];

export default function ProductGrid({
  products,
  meta,
  loading,
  sortBy,
  onSortChange,
  onPageChange,
}: Props) {
  return (
    <>
      {/* Header — count + sort */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Shop</h1>
          {meta && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              Products
            </p>
          )}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-full px-4 py-2 outline-none cursor-pointer hover:border-gray-400 transition"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 rounded-2xl aspect-square mb-3" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-gray-600">No products found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting or resetting your filters
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                slug: product.slug,
                image: product.image ?? "/images/placeholder.png",
                name: product.name,
                rating: `${product.rating}/5`,
                price: product.price,
                originalPrice: product.original_price ?? undefined,
                discount: product.discount ? product.discount : undefined,
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.total_pages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => onPageChange(meta.page - 1)}
            disabled={!meta.has_prev}
            className="px-4 py-2 text-sm rounded-full border border-gray-200
              disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition"
          >
            ← Previous
          </button>

          {/* Page numbers */}
          {[...Array(meta.total_pages)].map((_, i) => {
            const page = i + 1;
            const isActive = page === meta.page;
            // Show first, last, current ±1, and ellipsis
            const show =
              page === 1 ||
              page === meta.total_pages ||
              Math.abs(page - meta.page) <= 1;

            if (!show) {
              // Render ellipsis once per gap
              if (page === 2 || page === meta.total_pages - 1) {
                return (
                  <span key={page} className="px-2 text-gray-400 text-sm">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 text-sm rounded-full transition
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "border border-gray-200 hover:border-black"
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(meta.page + 1)}
            disabled={!meta.has_next}
            className="px-4 py-2 text-sm rounded-full border border-gray-200
              disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
