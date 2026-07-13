import { Product, Review, RelatedProduct } from "./types";

export const product: Product = {
  id: "1",
  slug: "one-life-graphic-tshirt",
  name: "One Life Graphic T-shirt",
  description:
    "This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric.",
  price: 260,
  originalPrice: 300,
  discount: 40,
  rating: 4.5,

  images: [
    {
      id: 1,
      src: "/images/detail_img_1.png",
    },
    {
      id: 2,
      src: "/images/detail_img_5.png",
    },
    {
      id: 3,
      src: "/images/detail_img_6.png",
    },
  ],

  colors: [
    {
      id: "brown",
      name: "Brown",
      hex: "#8B7355",
    },
    {
      id: "green",
      name: "Green",
      hex: "#314f49",
    },
    {
      id: "blue",
      name: "Blue",
      hex: "#31344f",
    },
  ],

  sizes: ["Small", "Medium", "Large", "X-Large"],
};

export const reviews: Review[] = [
  {
    id: 1,
    name: "Samantha D.",
    rating: 5,
    comment: "Absolutely love this t-shirt!",
    date: "August 14, 2023",
    verified: true,
  },
  {
    id: 2,
    name: "Alex M.",
    rating: 4,
    comment: "Great quality and very comfortable.",
    date: "August 15, 2023",
    verified: true,
  },
];

export const relatedProducts: RelatedProduct[] = [
  {
    id: 1,
    slug: "polo-contrast-trim",
    name: "Polo with Contrast Trims",
    price: 212,
    originalPrice: 242,
    discount: 20,
    rating: 4,
    image: "/images/image_7.png",
  },
  {
    id: 2,
    slug: "gradient-graphic-tshirt",
    name: "Gradient Graphic T-shirt",
    price: 145,
    rating: 3.5,
    image: "/images/image_8.png",
  },
];
