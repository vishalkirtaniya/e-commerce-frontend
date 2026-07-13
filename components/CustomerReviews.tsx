"use client";

import { useState } from "react";
import Image from "next/image";
import RatingBar from "@/components/ui/RatingBar";

export interface Customer {
  id: number;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
}

export interface CustomerReviewsProps {
  reviews: Customer[];
  loading: boolean;
}

const CustomerReviews = ({ reviews, loading }: CustomerReviewsProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (loading) {
    return (
      <section className="w-full mt-16 lg:mt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto py-10 lg:py-16">
          <div className="space-y-8">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-[240px] rounded-[20px] bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mt-16 lg:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto py-10 lg:py-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 lg:mb-10">
          <h2 className="font-integral text-[32px] leading-[36px] lg:text-[48px] lg:leading-[58px] font-bold uppercase max-w-[420px]">
            OUR HAPPY CUSTOMERS
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="hover:scale-110 transition-transform"
              aria-label="Previous Review"
            >
              <Image
                src="/icons/left_arrow.svg"
                alt="Previous"
                width={24}
                height={24}
              />
            </button>

            <button
              onClick={nextSlide}
              className="hover:scale-110 transition-transform"
              aria-label="Next Review"
            >
              <Image
                src="/icons/left_arrow.svg"
                alt="Next"
                width={24}
                height={24}
                className="rotate-180"
              />
            </button>
          </div>
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="min-w-full">
                <div className="border border-[#e5e5e5] rounded-[20px] p-6">
                  <div className="flex flex-col gap-3">
                    <RatingBar rating={review.rating} readonly />

                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[20px]">{review.name}</h4>

                      {review.verified && (
                        <Image
                          src="/icons/green_tick.svg"
                          alt="Verified"
                          width={20}
                          height={20}
                        />
                      )}
                    </div>

                    <p className="text-[#666666] text-[14px] leading-[22px]">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-[#e5e5e5] rounded-[20px] p-8"
            >
              <div className="flex flex-col gap-3 h-full">
                <RatingBar rating={review.rating} readonly />

                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[20px]">{review.name}</h4>

                  {review.verified && (
                    <Image
                      src="/icons/green_tick.svg"
                      alt="Verified"
                      width={20}
                      height={20}
                    />
                  )}
                </div>

                <p className="text-[#666666] text-base leading-[22px]">
                  "{review.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
