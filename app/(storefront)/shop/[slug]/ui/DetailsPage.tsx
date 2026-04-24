"use client";

import BreadCrumb from "@/components/ui/BreadCrumb";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";

// ── Types ─────────────────────────────────────────────────────
interface Size {
  id: number;
  label: string;
  price: number;
  is_default: boolean;
}

export interface Product {
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

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export interface RelatedProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
}

interface Props {
  product: Product;
  reviews: Review[];
  relatedProducts: RelatedProduct[];
}

export default function ProductDetailPage({
  product,
  reviews,
  relatedProducts,
}: Props) {
  console.log(`product: ${product.images}`)
  return (
    <div className="w-full bg-bg-main">
      <main className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-[20px]">
          <BreadCrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: product.name },
            ]}
          />
        </div>

        {/* Product section */}
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-[40px] mb-[70px]">
          <ProductGallery images={product.images} />

          <div className="w-full lg:w-[48%] flex flex-col">
            <ProductInfo product={product} />
          </div>
        </section>

        {/* Reviews + Tabs */}
        <ProductTabs description={product.description} reviews={reviews} />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </main>
    </div>
  );
}
