import Image from "next/image";
import Link from "next/link";
import RatingBar from "@/components/ui/RatingBar";
import { RelatedProduct } from "./types";

export default function RelatedProducts({
  products,
}: {
  products: RelatedProduct[];
}) {
  return (
    <section className="mt-20">
      <h2 className="text-4xl font-bold text-center mb-12">
        You might also like
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="space-y-3"
          >
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={350}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-semibold">{product.name}</h3>

            <div className="flex items-center gap-2">
              <RatingBar rating={product.rating} />
              <span className="text-sm">
                {product.rating}/5
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold">
                ${product.price}
              </span>

              {product.originalPrice && (
                <span className="line-through text-gray-400">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
