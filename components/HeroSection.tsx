"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";

const HeroSection = () => {
  const handleShopNow = () => {};

  return (
    <section className="w-full bg-[#f2f0f1] overflow-hidden">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-1/2 px-5 sm:px-8 lg:px-0 pt-10 lg:pt-24">
            <h1 className="font-integral text-[36px] leading-[34px] sm:text-[48px] sm:leading-[48px] lg:text-[64px] lg:leading-[64px] font-bold text-black max-w-[580px]">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>

            <p className="mt-5 text-[14px] leading-[20px] lg:text-base lg:leading-[22px] text-[#666666] max-w-[545px]">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>

            <div className="mt-6">
              <Button
                text="Shop Now"
                text_font_size="text-base"
                text_font_family="Satoshi"
                text_font_weight="font-medium"
                text_line_height="leading-[22px]"
                text_color="text-white"
                fill_background_color="bg-black"
                border_border_radius="rounded-full"
                className="w-full sm:w-auto px-20 py-4"
                onClick={handleShopNow}
              />
            </div>

            {/* MOBILE STATS */}
            <div className="mt-8 lg:hidden">
              <div className="grid grid-cols-2">
                <div className="text-center border-r border-black/10">
                  <h3 className="text-[28px] font-bold">200+</h3>
                  <p className="text-[12px] text-[#666666]">
                    International Brands
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-[28px] font-bold">2,000+</h3>
                  <p className="text-[12px] text-[#666666]">
                    High-Quality Products
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-[28px] font-bold">30,000+</h3>
                <p className="text-[12px] text-[#666666]">Happy Customers</p>
              </div>
            </div>

            {/* DESKTOP STATS */}
            <div className="hidden lg:flex gap-10 mt-12">
              <div>
                <h3 className="text-[40px] font-bold">200+</h3>
                <p className="text-[#666666]">International Brands</p>
              </div>

              <div className="border-l border-black/10 pl-10">
                <h3 className="text-[40px] font-bold">2,000+</h3>
                <p className="text-[#666666]">High-Quality Products</p>
              </div>

              <div className="border-l border-black/10 pl-10">
                <h3 className="text-[40px] font-bold">30,000+</h3>
                <p className="text-[#666666]">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative h-[450px] sm:h-[550px] lg:h-[700px]">
              <Image
                src="/images/heroImage.png"
                alt="Fashion Models"
                fill
                priority
                className="object-contain object-bottom"
              />

              {/* Big Star */}
              <Image
                src="/icons/star.svg"
                alt=""
                width={76}
                height={76}
                className="absolute top-12 right-6 lg:top-24 lg:right-10"
              />

              {/* Small Star */}
              <Image
                src="/icons/star.svg"
                alt=""
                width={34}
                height={34}
                className="absolute top-40 left-5 lg:top-80 lg:left-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
