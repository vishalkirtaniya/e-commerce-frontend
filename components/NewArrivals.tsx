"use client";

import Button from "@/components/ui/Button";
import RatingBar from "@/components/ui/RatingBar";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  image: string;
}

interface NewArrivalsProps {
  products: Product[];
  loading: boolean;
}

const NewArrivals = ({ products, loading }: NewArrivalsProps) => {
  const handleViewAll = (): void => {
    console.log("View All");
  };

  const handleProductClick = (productId: number): void => {
    console.log(productId);
  };

  return (
    <section className="w-full mt-12 lg:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto py-10 lg:py-16">
        <div className="flex flex-col items-center">
          {/* Section Title */}
          <h2 className="font-integral text-[32px] leading-[36px] lg:text-[48px] lg:leading-[58px] font-bold text-center text-black">
            NEW ARRIVALS
          </h2>

          {/* Products */}
          {loading ? (
            <div className="flex overflow-hidden gap-4 w-full mt-10">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[190px] lg:w-auto flex flex-col gap-4"
                >
                  <div className="h-[200px] lg:h-[298px] rounded-[20px] bg-gray-200 animate-pulse" />

                  <div className="space-y-2">
                    <div className="h-5 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
                    <div className="h-6 w-1/2 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                flex
                overflow-x-auto
                gap-4
                w-full
                mt-10
                pb-2
                scrollbar-hide

                lg:grid
                lg:grid-cols-4
                lg:gap-5
              "
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="
                    flex-shrink-0
                    w-[170px]
                    sm:w-[190px]
                    lg:w-auto
                    flex
                    flex-col
                    gap-4
                    cursor-pointer
                    group
                  "
                >
                  {/* Product Image */}
                  <div className="overflow-hidden rounded-[20px] bg-[#f0f0f0]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        w-full
                        h-[200px]
                        lg:h-[298px]
                        object-cover
                        group-hover:scale-105
                        transition-transform
                        duration-300
                      "
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col gap-1">
                    {/* Name */}
                    <h3 className="text-[16px] lg:text-[20px] font-bold text-black leading-tight">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <RatingBar rating={product.rating} readonly />

                      <span className="text-[12px] lg:text-[14px]">
                        {product.rating}/5
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-[24px] font-bold text-black">
                        {product.price}
                      </span>

                      {product.originalPrice && (
                        <span className="text-[24px] font-bold text-gray-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}

                      {product.discount && (
                        <span className="px-3 py-1 rounded-full text-[12px] font-medium bg-red-100 text-red-500">
                          {product.discount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="w-full flex justify-center mt-10">
            <Button
              text="View All"
              text_font_size="text-base"
              text_font_family="Satoshi"
              text_font_weight="font-medium"
              text_line_height="leading-[22px]"
              text_color="text-black"
              fill_background_color="bg-transparent"
              border_border="border border-[#e5e5e5]"
              border_border_radius="rounded-full"
              className="w-full sm:w-auto min-w-[220px] py-3 px-6"
              onClick={handleViewAll}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#e5e5e5] mt-12 lg:mt-16" />
      </div>
    </section>
  );
};

export default NewArrivals;