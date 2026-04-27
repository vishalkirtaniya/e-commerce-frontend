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
    // Navigate to all products page
  };

  const handleProductClick = (productId: number): void => {
    // Navigate to product detail page
  };

  return (
    <section className="w-full bg-secondary-background mt-[96px] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1240px] mx-auto py-[62px]">
        <div className="flex flex-col gap-[32px] justify-start items-center">
          {/* Section Title */}
          <h2 className="text-[36px] sm:text-[48px] font-bold leading-[41px] sm:leading-[55px] text-center text-text-primary font-aclonica">
            NEW ARRIVALS
          </h2>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-[16px]">
                  <div className="w-full h-[298px] bg-secondary-dark rounded-[20px] animate-pulse"></div>
                  <div className="flex flex-col gap-[8px]">
                    <div className="h-[20px] bg-secondary-dark rounded animate-pulse"></div>
                    <div className="h-[16px] bg-secondary-dark rounded animate-pulse w-2/3"></div>
                    <div className="h-[24px] bg-secondary-dark rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] w-full">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-[16px] cursor-pointer group"
                  onClick={() => handleProductClick(product.id)}
                >
                  {/* Product Image */}
                  <div className="relative w-full bg-secondary-dark rounded-[20px] overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[250px] sm:h-[298px] object-cover rounded-[20px] group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col gap-[6px] justify-start items-start">
                    {/* Product Name */}
                    <h3 className="text-lg sm:text-[20px] font-bold leading-[24px] sm:leading-[27px] text-left text-text-primary font-satoshi capitalize">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-[12px]">
                      <RatingBar rating={product.rating} readonly />
                      <span className="text-sm font-normal leading-[19px] text-text-primary font-satoshi">
                        {product.rating}/5
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-[10px]">
                      <span className="text-xl sm:text-[24px] font-bold leading-[27px] sm:leading-[33px] text-text-primary font-satoshi">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="text-xl sm:text-[24px] font-bold leading-[27px] sm:leading-[33px] text-text-secondary line-through font-satoshi">
                            {product.originalPrice}
                          </span>
                          {product.discount && (
                            <Button
                              text={product.discount}
                              text_font_size="text-xs"
                              text_font_family="Satoshi"
                              text_font_weight="font-medium"
                              text_line_height="leading-tight"
                              text_color="text-accent-color"
                              fill_background_color="bg-accent-light"
                              border_border_radius="rounded-sm"
                              padding="py-[4px] px-[12px]"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <Button
            text="View All"
            text_font_size="text-base"
            text_font_family="Satoshi"
            text_font_weight="font-medium"
            text_line_height="leading-[22px]"
            text_color="text-text-primary"
            fill_background_color="bg-transparent"
            border_border="border border-border-primary"
            border_border_radius="rounded-[26px]"
            className="px-5 py-1"
            onClick={handleViewAll}
          />
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-border-primary mt-[64px]"></div>
      </div>
    </section>
  );
};

export default NewArrivals;
