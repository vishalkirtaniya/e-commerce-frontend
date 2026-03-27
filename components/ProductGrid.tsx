"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { API_URL } from "../lib/api";

 export interface Product {
  id: string;
  name: string;
  price: number;
  product_images?: { image_url: string }[];
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <p className="text-sm text-gray-500">
          Showing {products.length} Products
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const image =
            product.product_images?.[0]?.image_url || "/placeholder.png";

          return (
            <ProductCard
              key={product.id}
              product={{
                slug: product.id,
                image,
                name: product.name,
                rating: "4.5/5",
                price: product.price,
              }}
            />
          );
        })}
      </div>
    </>
  );
}