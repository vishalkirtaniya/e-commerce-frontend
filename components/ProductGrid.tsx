// components/ProductGrid.tsx
import ProductCard, { Product } from "./ProductCard";

const PRODUCTS: Product[] = [
  {
    slug: "one-life-graphic-tshirt",
    image: "/images/image_7.png",
    name: "Gradient Graphic T-shirt",
    rating: "3.5/5",
    price: 145,
    originalPrice: 160,
    discount: 10,
  },
  {
    slug: "one-life-graphic-tshirt",
    image: "/images/image_8.png",
    name: "Polo with Tipping Details",
    rating: "4.5/5",
    price: 180,
  },
  {
    slug: "one-life-graphic-tshirt",
    image: "/images/image_9.png",
    name: "Black Striped T-shirt",
    rating: "5.0/5",
    price: 120,
    originalPrice: 150,
    discount: 30,
  },
  // more...
];


export default function ProductGrid() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Casual</h1>
        <p className="text-sm text-gray-500">
          Showing 1–10 of 100 Products ·{" "}
          <span className="font-medium cursor-pointer">
            Sort by: Most Popular
          </span>
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {PRODUCTS.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </>
  );
}
