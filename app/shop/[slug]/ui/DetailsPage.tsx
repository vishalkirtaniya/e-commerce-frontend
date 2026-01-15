"use client";

import { Product, Review, RelatedProduct } from "./types";
import BreadCrumb from "@/components/ui/BreadCrumb";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";

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

        {/* Product Section — SAME AS ORIGINAL */}
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-[40px] mb-[70px]">
          {/* Product Images */}
          <ProductGallery images={product.images} />

          {/* Product Details (RIGHT COLUMN) */}
          <div className="w-full lg:w-[48%] flex flex-col">
            <ProductInfo product={product} />
          </div>
        </section>

        {/* Reviews + Tabs */}
        <ProductTabs
          description={product.description}
          reviews={reviews}
        />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </main>
    </div>
  );
}
