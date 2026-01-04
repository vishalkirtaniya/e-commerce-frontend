"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadCrumb from "@/components/ui/BreadCrumb";
import Button from "@/components/ui/Button";
import RatingBar from "@/components/ui/RatingBar";
import Dropdown from "@/components/ui/DropDown";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  image: string;
}

export default function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState("brown");
  const [selectedSize, setSelectedSize] = useState("large");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    "/images/detail_img_1.png"
  );
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "faq">(
    "reviews"
  );

  const productImages = [
    "/images/detail_img_1.png",
    "/images/detail_img_5.png",
    "/images/detail_img_6.png",
  ];

  const colors = [
    { id: "brown", name: "Brown", color: "#8B7355", selected: true },
    { id: "green", name: "Green", color: "#314f49" },
    { id: "blue", name: "Blue", color: "#31344f" },
  ];

  const sizes = ["Small", "Medium", "Large", "X-Large"];

  const reviews: Review[] = [
    {
      id: "1",
      name: "Samantha D.",
      rating: 5,
      comment:
        "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It has become my favorite go-to shirt.",
      date: "August 14, 2023",
      verified: true,
    },
    {
      id: "2",
      name: "Alex M.",
      rating: 4,
      comment:
        "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I am quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
      date: "August 15, 2023",
      verified: true,
    },
    {
      id: "3",
      name: "Ethan R.",
      rating: 5,
      comment:
        "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer touch in every aspect of this shirt.",
      date: "August 16, 2023",
      verified: true,
    },
    {
      id: "4",
      name: "Olivia P.",
      rating: 5,
      comment:
        "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It is evident that the designer poured their creativity into making this t-shirt stand out.",
      date: "August 17, 2023",
      verified: true,
    },
    {
      id: "5",
      name: "Liam K.",
      rating: 5,
      comment:
        "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer skill. It is like wearing a piece of art that reflects my passion for both design and fashion.",
      date: "August 18, 2023",
      verified: true,
    },
    {
      id: "6",
      name: "Ava H.",
      rating: 4,
      comment:
        "I am not just wearing a t-shirt; I am wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
      date: "August 19, 2023",
      verified: true,
    },
  ];

  const relatedProducts: Product[] = [
    {
      id: "1",
      name: "Polo with Contrast Trims",
      price: 212,
      originalPrice: 242,
      discount: 20,
      rating: 4.0,
      image: "/images/image_7.png",
    },
    {
      id: "2",
      name: "Gradient Graphic T-shirt",
      price: 145,
      originalPrice: 145,
      discount: 0,
      rating: 3.5,
      image: "/images/image_8.png",
    },
    {
      id: "3",
      name: "Polo with Tipping Details",
      price: 180,
      originalPrice: 180,
      discount: 0,
      rating: 4.5,
      image: "/images/image_9.png",
    },
    {
      id: "4",
      name: "Black Striped T-shirt",
      price: 120,
      originalPrice: 150,
      discount: 30,
      rating: 5.0,
      image: "/images/image_10.png",
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "T-shirts" },
  ];

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
  };

  return (
    <div className="w-full bg-bg-main">
      <Header />

      {/* Main Content */}
      <main className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mt-[32px] mb-[60px]">
          <BreadCrumb items={breadcrumbItems} />
        </div>

        {/* Product Section */}
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-[40px] mb-[70px]">
          {/* Product Images */}
          <div className="flex flex-col md:flex-row gap-[14px] w-full lg:w-[55%]">
            {/* Thumbnail Images */}
            <div className="flex md:flex-col gap-[14px] order-2 md:order-1 w-full md:w-[24%]">
              {productImages.map((img) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-full md:w-[152px] h-[120px] md:h-[166px] rounded-[20px] overflow-hidden bg-secondary-dark border-2 transition-all ${
                    selectedImage === img
                      ? "border-text-primary scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                >
                  <Image
                    src={img}
                    alt="Product thumbnail"
                    width={152}
                    height={166}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image */}
            <div className="order-1 md:order-2 w-full md:w-[70%] h-[300px] md:h-[530px] rounded-[20px] overflow-hidden bg-secondary-dark ml-0 md:ml-[14px]">
              <Image
                src={selectedImage}
                alt="Selected product image"
                width={444}
                height={530}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-[48%] flex flex-col">
            <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[34px] sm:leading-[40px] md:leading-[48px] text-text-primary font-integral mb-4">
              One Life Graphic T-shirt
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-[10px]">
              <RatingBar rating={4.5} />
              <span className="text-base font-normal leading-[22px] text-text-primary font-satoshi">
                <span>4.5/</span>
                <span className="text-text-muted">5</span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[24px] sm:text-[32px] font-bold leading-[33px] sm:leading-[44px] text-text-primary font-satoshi">
                $260
              </span>
              <span className="text-[24px] sm:text-[32px] font-bold leading-[33px] sm:leading-[44px] text-text-accent line-through font-satoshi opacity-30">
                $300
              </span>
              <Button
                text="-40%"
                text_font_size="text-base"
                text_font_weight="font-medium"
                text_color="text-[#FF3333]"
                fill_background_color="bg-[#f0f0f0]"
                border_border_radius="rounded-full"
                className="ml-2 px-4 py-2"
              />
            </div>

            {/* Description */}
            <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi w-full max-w-[98%] mb-6">
              This graphic t-shirt which is perfect for any occasion. Crafted
              from a soft and breathable fabric, it offers superior comfort and
              style.
            </p>

            {/* Divider */}
            <div className="w-full h-[1px] bg-border-primary mb-6"></div>

            {/* Select Colors */}
            <div className="mb-6">
              <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mb-2">
                Select Colors
              </p>
              <div className="flex items-center gap-4">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-[36px] h-[36px] rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.id
                        ? "border-text-primary scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.color }}
                    aria-label={`Select ${color.name} color`}
                  >
                    {selectedColor === color.id && (
                      <div className="w-full h-full flex justify-center items-center">
                        <Image
                          src="/icons/white_tick.svg"
                          alt="Selected"
                          width={36}
                          height={36}
                          className="w-1/2 h-1/2"
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-border-primary mb-6"></div>

            {/* Choose Size */}
            <div className="mb-6">
              <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mb-2">
                Choose Size
              </p>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    text={size}
                    text_font_size="text-base"
                    text_font_weight={
                      selectedSize === size.toLowerCase()
                        ? "font-medium"
                        : "font-normal"
                    }
                    text_color={
                      selectedSize === size.toLowerCase()
                        ? "text-[#f0f0f0]"
                        : "text-[#000000]"
                    }
                    fill_background_color={
                      selectedSize === size.toLowerCase()
                        ? "bg-[#000000]"
                        : "bg-[#f0f0f0]"
                    }
                    border_border_radius="rounded-full"
                    className="px-6 py-3 border border-black"
                    onClick={() => setSelectedSize(size.toLowerCase())}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-border-primary mb-6"></div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-[#f0f0f0] rounded-[26px] px-1 py-3.5 w-full sm:w-[30%]">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-6 h-6 flex items-center justify-center text-3xl hover:bg-[#ffffff] transition rounded-full my-auto mx-auto"
                  aria-label="Decrease quantity"
                >
                  <Image
                    src="/icons/minus.svg"
                    alt="Decrease"
                    width={24}
                    height={24}
                    className="w-3 h-3"
                  />
                </button>
                <span className="text-base font-medium leading-[22px] text-text-primary font-satoshi">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-6 h-6 flex items-center justify-center text-3xl hover:bg-[#ffffff] transition rounded-full my-auto mx-auto"
                  aria-label="Increase quantity"
                >
                  <Image
                    src="/icons/plus.svg"
                    alt="Increase"
                    width={24}
                    height={24}
                    className="w-3 h-3"
                  />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                text="Add to Cart"
                text_font_size="text-base"
                text_font_weight="font-medium"
                text_color="text-[#ffffff]"
                fill_background_color="bg-[#000000]"
                border_border_radius="rounded-[26px]"
                onClick={handleAddToCart}
                className="w-full sm:flex-1 px-20 py-3.5"
              />
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-[64px]">
          {/* Tab Navigation */}
          <div className="flex flex-col mb-[22px]">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mb-[14px]">
              <div className="flex items-center justify-around w-full">
                {/* Product Details */}
                <button
                  onClick={() => setActiveTab("details")}
                  className={`w-1/3 text-center border-b-2 pb-3 text-lg sm:text-[20px] font-satoshi transition-colors ${
                    activeTab === "details"
                      ? "text-text-primary font-medium border-text-primary"
                      : "text-text-muted font-normal border-transparent"
                  }`}
                >
                  Product Details
                </button>

                {/* Rating & Reviews */}
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`w-1/3 text-center border-b-2 pb-3 text-lg sm:text-[20px] font-satoshi transition-colors ${
                    activeTab === "reviews"
                      ? "text-text-primary font-medium border-text-primary"
                      : "text-text-muted font-normal border-transparent"
                  }`}
                >
                  Rating & Reviews
                </button>

                {/* FAQ */}
                <button
                  onClick={() => setActiveTab("faq")}
                  className={`w-1/3 text-center border-b-2 pb-3 text-lg sm:text-[20px] font-satoshi transition-colors ${
                    activeTab === "faq"
                      ? "text-text-primary font-medium border-text-primary"
                      : "text-text-muted font-normal border-transparent"
                  }`}
                >
                  FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-[30px]">
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] sm:text-[24px] font-bold leading-[27px] sm:leading-[33px] text-text-primary font-satoshi">
                All Reviews
              </h2>
              <span className="text-base font-normal leading-[22px] text-text-muted font-satoshi">
                (451)
              </span>
            </div>

            <div className="flex items-center gap-[10px]">
              <button className="w-[48px] h-[48px] bg-secondary-light rounded-[24px] flex items-center justify-center hover:bg-secondary-dark transition-colors">
                <Image
                  src="/icons/filter.svg"
                  alt="Filter"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
              <Dropdown
                placeholder="Latest"
                text_font_size="text-base"
                text_font_weight="font-medium"
                text_color="text-text-primary"
                fill_background_color="bg-secondary-light"
                border_border_radius="rounded-[24px]"
                layout_width="16%"
                padding="t-[14px] r-[30px] b-[14px] l-[14px]"
              />
              <Button
                text="Write a Review"
                text_font_size="text-base"
                text_font_weight="font-medium"
                text_color="text-secondary-background"
                fill_background_color="bg-text-primary"
                border_border_radius="rounded-[24px]"
                padding="t-[12px] r-[28px] b-[12px] l-[28px]"
              />
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8 transition duration-300">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="border border-border-primary rounded-[20px] p-6 sm:p-8"
              >
                <div className="flex justify-between items-start mb-[10px]">
                  <RatingBar rating={review.rating} />
                  <button className="w-6 h-6 hover:scale-110 transition-transform">
                    <Image
                      src="/icons/3dots.svg"
                      alt="More options"
                      width={24}
                      height={24}
                      className="w-full h-full"
                    />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[18px] sm:text-[20px] font-bold leading-[27px] text-text-primary font-satoshi">
                      {review.name}
                    </h3>
                    {review.verified && (
                      <Image
                        src="/icons/green_tick.svg"
                        alt="Verified"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    )}
                  </div>
                  <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi">
                    "{review.comment}"
                  </p>
                </div>

                <p className="text-base font-medium leading-[22px] text-text-muted font-satoshi">
                  Posted on {review.date}
                </p>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center">
            <Button
              text="Load More Reviews"
              text_font_size="text-base"
              text_font_weight="font-medium"
              text_color="text-text-primary"
              fill_background_color="bg-transparent"
              border_border_radius="rounded-[26px]"
              border_border="1px solid #00000019"
              className="border border-border-primary hover:bg-secondary-light transition-colors px-5 py-1"
              onClick={() => setVisibleReviews((prev) => prev + 2)}
            />
          </div>
        </section>

        {/* Related Products */}
        <section className="mb-[64px]">
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-[40px] sm:leading-[50px] md:leading-[58px] text-center text-text-primary font-integral mb-[54px]">
            You might also like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((product) => (
              <div key={product.id} className="flex flex-col gap-4">
                <div className="w-full h-[200px] sm:h-[250px] lg:h-[298px] bg-secondary-dark rounded-[20px] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={294}
                    height={298}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-[18px] sm:text-[20px] font-bold leading-[27px] text-text-primary font-satoshi">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <RatingBar rating={product.rating} />
                    <span className="text-sm font-normal leading-[19px] text-text-primary font-satoshi">
                      <span>{product.rating}</span>
                      <span className="text-text-muted">/5</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-[10px]">
                    <span className="text-[20px] sm:text-[24px] font-bold leading-[33px] text-text-primary font-satoshi">
                      ${product.price}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-[20px] sm:text-[24px] font-bold leading-[33px] text-text-secondary line-through font-satoshi">
                          ${product.originalPrice}
                        </span>
                        <Button
                          text={`-${product.discount}%`}
                          text_font_size="text-xs"
                          text_font_weight="font-medium"
                          text_color="text-accent-color"
                          fill_background_color="bg-accent-light"
                          border_border_radius="rounded-[14px]"
                          padding="t-[4px] r-[12px] b-[4px] l-[12px]"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
