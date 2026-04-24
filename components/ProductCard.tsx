// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";

export interface Product {
  image: string;
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
  console.log(product);
  return (
    <Link href={`/shop/${product.slug}`} className="block space-y-2 group">
      <div className="bg-gray-100 rounded-xl overflow-hidden z-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-[1.02] transition"
        />
      </div>

      <h3 className="text-sm font-medium group-hover:underline">
        {product.name}
      </h3>

      <div className="text-sm text-yellow-500">
        ★★★★★ <span className="text-gray-400">{product.rating}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold">₹{product.price}</span>

        {product.originalPrice && (
          <span className="line-through text-gray-400">
            ₹{product.originalPrice}
          </span>
        )}

        {product.discount && (
          <span className="text-red-500 text-xs">-{product.discount}%</span>
        )}
      </div>
    </Link>
  );
}
