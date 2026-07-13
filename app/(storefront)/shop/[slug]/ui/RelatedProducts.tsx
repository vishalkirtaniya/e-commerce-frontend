import Link from "next/link";
import RatingBar from "@/components/ui/RatingBar";
import { RelatedProduct } from "./types";

export default function RelatedProducts({
  products,
}: {
  products: RelatedProduct[];
}) {
  return (
    <section className="mt-16 lg:mt-20">
      <h2 className="font-integral text-[32px] lg:text-[48px] font-bold text-center mb-10">
        YOU MIGHT ALSO LIKE
      </h2>

      <div
        className="
          flex
          overflow-x-auto
          gap-4
          pb-2
          scrollbar-hide

          lg:grid
          lg:grid-cols-4
          lg:gap-6
        "
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="
              flex-shrink-0
              w-[170px]
              sm:w-[190px]
              lg:w-auto
              space-y-3
            "
          >
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[220px] lg:h-[300px] object-cover"
              />
            </div>

            <h3 className="font-semibold">{product.name}</h3>

            <div className="flex items-center gap-2">
              <RatingBar rating={product.rating} />
              <span className="text-sm">{product.rating}/5</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold">₹{product.price}</span>

              {product.originalPrice && (
                <span className="line-through text-gray-400">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
