"use client";
import { useState, useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ProductCategories from "@/components/ProductCategories";
import NewArrivals from "@/components/NewArrivals";
import TopSelling from "@/components/TopSelling";
import CustomerReviews from "@/components/CustomerReviews";
import { API_URL } from "@/lib/api";

// ── Types matching backend response shapes ─────────────────────
export interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  rating: number;
  image: string | null;
  images: string[];
}

interface ApiReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
}

// ── Types expected by UI components ───────────────────────────
interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  image: string;
}

interface Customer {
  id: number;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
}

// ── Helpers ───────────────────────────────────────────────────
function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDiscount(discount: number): string {
  return `-${discount}%`;
}

function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: formatPrice(p.price),
    originalPrice: p.original_price ? formatPrice(p.original_price) : undefined,
    discount: p.discount ? formatDiscount(p.discount) : undefined,
    rating: p.rating,
    image: p.image ?? "/images/placeholder.png",
  };
}

// ── Page component ────────────────────────────────────────────
export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);
  const [customerReviews, setCustomerReviews] = useState<Customer[]>([]);

  const [loadingArrivals, setLoadingArrivals] = useState(true);
  const [loadingTopSelling, setLoadingTopSelling] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Tracks whether the scroll trigger has already fired this visit
  const hasTriggered = useRef(false);

  // ── Scroll trigger ─────────────────────────────────────────
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (hasTriggered.current) return;
      if (e.clientX >= window.innerWidth - 10) {
        hasTriggered.current = true;
        window.dispatchEvent(new CustomEvent("open-cart"));
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    function handleCartClose() {
      setTimeout(() => {
        hasTriggered.current = false;
      }, 1000);
    }
    window.addEventListener("close-cart", handleCartClose);
    return () => window.removeEventListener("close-cart", handleCartClose);
  }, []);

  // ── Data fetching ──────────────────────────────────────────
  useEffect(() => {
    loadHomePageData();
  }, []);

  const loadHomePageData = async (): Promise<void> => {
    await Promise.allSettled([
      fetchNewArrivals(),
      fetchTopSelling(),
      fetchReviews(),
    ]);
  };

  const fetchNewArrivals = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/new-arrivals?limit=4`);
      if (!res.ok) throw new Error(`new-arrivals: ${res.status}`);
      const json: { data: ApiProduct[] } = await res.json();
      setNewArrivals(json.data.map(mapProduct));
    } catch (err) {
      console.error("Failed to load new arrivals:", err);
      setError("Failed to load some content. Please refresh.");
    } finally {
      setLoadingArrivals(false);
    }
  };

  const fetchTopSelling = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/top-selling?limit=4`);
      if (!res.ok) throw new Error(`top-selling: ${res.status}`);
      const json: { data: ApiProduct[] } = await res.json();
      setTopSellingProducts(json.data.map(mapProduct));
    } catch (err) {
      console.error("Failed to load top selling:", err);
      setError("Failed to load some content. Please refresh.");
    } finally {
      setLoadingTopSelling(false);
    }
  };

  const fetchReviews = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/reviews?limit=3&featured=true`);
      if (!res.ok) throw new Error(`reviews: ${res.status}`);
      const json: { data: ApiReview[] } = await res.json();
      setCustomerReviews(json.data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load some content. Please refresh.");
    } finally {
      setLoadingReviews(false);
    }
  };

  return (
    <main>
      {error && (
        <div className="w-full bg-red-50 text-red-600 text-sm text-center py-2 px-4">
          {error}
        </div>
      )}
      <HeroSection />
      <ProductCategories />
      <NewArrivals products={newArrivals} loading={loadingArrivals} />
      <TopSelling products={topSellingProducts} loading={loadingTopSelling} />
      <CustomerReviews reviews={customerReviews} loading={loadingReviews} />
    </main>
  );
}
