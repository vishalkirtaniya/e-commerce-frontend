"use client";

import { useState, useEffect, useCallback } from "react";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import BreadCrumb from "@/components/ui/BreadCrumb";
import { API_URL } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────
export interface FilterOptions {
  categories: { id: number; name: string; slug: string }[];
  occasions: { id: number; name: string; slug: string }[];
  materials: string[];
  price_range: { min: number; max: number };
}

export interface ActiveFilters {
  category: string;
  occasion: string;
  material: string;
  min_price: number;
  max_price: number;
  sort_by: string;
  page: number;
}

export interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  rating: number;
  review_count: number;
  material: string;
  category_name: string;
  image: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Shop" }];

const DEFAULT_FILTERS: ActiveFilters = {
  category: "",
  occasion: "",
  material: "",
  min_price: 0,
  max_price: 10000,
  sort_by: "newest",
  page: 1,
};

export default function ShopPage() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null,
  );
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch sidebar filter options once on mount ──────────────
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const res = await fetch(`${API_URL}/api/products/filters`);
        if (!res.ok) throw new Error("Failed to load filters");
        const data: FilterOptions = await res.json();
        setFilterOptions(data);

        // Set price range defaults from real DB values
        setFilters((prev) => ({
          ...prev,
          min_price: data.price_range.min,
          max_price: data.price_range.max,
        }));
      } catch (err) {
        console.error(err);
        setError("Failed to load filter options");
      } finally {
        setLoadingFilters(false);
      }
    }

    fetchFilterOptions();
  }, []);

  // ── Fetch products whenever filters change ──────────────────
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.occasion) params.set("occasion", filters.occasion);
      if (filters.material) params.set("material", filters.material);
      if (filters.min_price) params.set("min_price", String(filters.min_price));
      if (filters.max_price < 10000)
        params.set("max_price", String(filters.max_price));
      if (filters.sort_by) params.set("sort_by", filters.sort_by);
      params.set("page", String(filters.page));
      params.set("limit", "12");

      const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load products");

      const json: { data: ApiProduct[]; meta: PaginationMeta } =
        await res.json();
      setProducts(json.data);
      setMeta(json.meta);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Filter change handlers ──────────────────────────────────
  const handleFilterChange = (updated: Partial<ActiveFilters>) => {
    // Reset to page 1 whenever a filter changes (except page itself)
    setFilters((prev) => ({ ...prev, ...updated, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sort_by: string) => {
    setFilters((prev) => ({ ...prev, sort_by, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      min_price: filterOptions?.price_range.min ?? 0,
      max_price: filterOptions?.price_range.max ?? 10000,
    });
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 pb-6">
      <div className="py-[20px]">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {error && (
        <div className="w-full bg-red-50 text-red-600 text-sm text-center py-2 px-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Filters sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <FiltersSidebar
            filterOptions={filterOptions}
            activeFilters={filters}
            loading={loadingFilters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Product grid */}
        <section className="col-span-12 md:col-span-9">
          <ProductGrid
            products={products}
            meta={meta}
            loading={loadingProducts}
            sortBy={filters.sort_by}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
          />
        </section>
      </div>
    </main>
  );
}
