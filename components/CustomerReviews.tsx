'use client';
import { useState } from 'react';
 import Image from'next/image';
 import RatingBar from'@/components/ui/RatingBar';

interface Customer {
  id: number
  name: string
  rating: number
  comment: string
  verified: boolean
}

interface CustomerReviewsProps {
  reviews: Customer[]
  loading: boolean
}

const CustomerReviews = ({ reviews, loading }: CustomerReviewsProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length)
  }

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  if (loading) {
    return (
      <section className="w-full bg-secondary-background mt-[170px] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1240px] mx-auto py-[80px]">
          <div className="flex flex-col gap-[40px] justify-start items-start">
            <div className="w-full h-[58px] bg-secondary-dark rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] w-full">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[240px] bg-secondary-dark rounded-[20px] animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-secondary-background mt-[170px] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1240px] mx-auto py-[80px]">
        <div className="flex flex-col gap-[40px] justify-start items-start">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full">
            <h2 className="text-[36px] sm:text-[48px] font-bold leading-[43px] sm:leading-[58px] text-left text-text-primary font-integral">
              OUR HAPPY CUSTOMERS
            </h2>
            
            {/* Navigation Arrows */}
            <div className="flex items-center gap-[16px] mt-4 lg:mt-0">
              <button
                onClick={prevSlide}
                className="w-[24px] h-[24px] hover:scale-110 transition-transform"
                aria-label="Previous review"
              >
                <Image
                  src="/icons/left_arrow.svg"
                  alt="Previous"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </button>
              <button
                onClick={nextSlide}
                className="w-[24px] h-[24px] hover:scale-110 transition-transform"
                aria-label="Next review"
              >
                <Image
                  src="/icons/left_arrow.svg"
                  alt="Next"
                  width={24}
                  height={24}
                  className="w-full h-full -rotate-180"
                />
              </button>
            </div>
          </div>

          {/* Reviews Slider */}
          <div className="w-full overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out gap-[20px] py-3">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] rounded-[20px] p-[28px] border-color-text-secondary border"
                >
                  <div className="flex flex-col gap-[12px] h-full">
                    
                    {/* Rating */}
                    <RatingBar rating={review.rating} readonly />
                    
                    {/* User Info and Comment */}
                    <div className="flex flex-col gap-[8px] flex-grow">
                      <div className="flex items-center gap-[8px]">
                        <h4 className="text-[20px] font-bold leading-[27px] text-text-primary font-satoshi">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <Image
                            src="/icons/green_tick.svg"
                            alt="Verified"
                            width={20}
                            height={20}
                            className="w-[24px] h-[24px]"
                          />
                        )}
                      </div>
                      
                      <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi flex-grow">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomerReviews