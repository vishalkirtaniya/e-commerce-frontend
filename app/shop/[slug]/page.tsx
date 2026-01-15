import { Metadata } from "next";
import ProductDetailPage from "./ui/DetailsPage";
import { product, reviews, relatedProducts } from "./ui/mockData";

export const metadata: Metadata = {
  title: "One Life Graphic T-shirt | SHOP.CO",
};

export default function Page() {
  return (
    <ProductDetailPage
      product={product}
      reviews={reviews}
      relatedProducts={relatedProducts}
    />
  );
}
