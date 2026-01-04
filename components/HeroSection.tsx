'use client';
import Button from'@/components/ui/Button';
import Image from'next/image';
 

const HeroSection = () => {
  const handleShopNow = (): void => {
    // Navigate to shop page
  }

  return (
    <section 
      className="w-full bg-cover bg-center bg-no-repeat pt-[86px] pb-[86px] px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: 'url(/images/heroImage.png)', backgroundColor: "#f2f0f1" }}
    >
      <div className="w-full max-w-[1240px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-start items-start w-full">
          
          {/* Left Content */}
          <div className="flex flex-col justify-start items-start w-full lg:w-[622px] px-[18px] lg:px-[18px] mt-[16px]">
            
            {/* Main Heading */}
            <h1 className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold leading-[40px] sm:leading-[52px] md:leading-[60px] lg:leading-[64px] text-left text-text-primary font-integral w-full lg:w-[92%]">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>

            {/* Description */}
            <p className="text-base font-normal leading-[22px] text-left text-text-muted font-satoshi w-full lg:w-[86%] mt-[32px]">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>

            {/* Shop Now Button */}
            <div className="mt-[32px]">
              <Button
                text="Shop Now"
                text_font_size="text-base"
                text_font_family="Satoshi"
                text_font_weight="font-medium"
                text_line_height="leading-[22px]"
                text_color="text-white"
                fill_background_color="bg-[#000000]"
                border_border_radius="rounded-[26px]"
                className='py-4 px-16'
                onClick={handleShopNow}
              />
            </div>

            {/* Statistics */}
            <div className="flex flex-col sm:flex-row gap-[32px] w-full lg:w-[calc(100%-26px)] mt-[48px]">
              
              <div className="flex flex-col justify-start items-start w-auto">
                <h3 className="text-[32px] sm:text-[40px] font-bold leading-[43px] sm:leading-[54px] text-left text-text-primary font-satoshi">
                  200+
                </h3>
                <p className="text-base font-normal leading-[22px] text-left text-text-muted font-satoshi">
                  International Brands
                </p>
              </div>

              <div className="flex flex-col justify-start items-start w-auto">
                <h3 className="text-[32px] sm:text-[40px] font-bold leading-[43px] sm:leading-[54px] text-left text-text-primary font-satoshi">
                  2,000+
                </h3>
                <p className="text-base font-normal leading-[22px] text-left text-text-muted font-satoshi">
                  High-Quality Products
                </p>
              </div>

              <div className="flex flex-col justify-start items-start w-auto lg:w-[170px]">
                <h3 className="text-[32px] sm:text-[40px] font-bold leading-[43px] sm:leading-[54px] text-left text-text-primary font-satoshi">
                  30,000+
                </h3>
                <p className="text-base font-normal leading-[22px] text-left text-text-muted font-satoshi">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>

          {/* Right Decorative Elements */}
          <div className="flex flex-col gap-[106px] justify-start items-start w-full lg:w-auto mt-[0px] lg:ml-auto">
            
            <div className="w-[104px] h-[104px] rounded-[52px] self-end">
              <Image
                src="/icons/star.svg"
                alt="decorative image"
                width={104}
                height={104}
              />
            </div>
            <div className="w-[56px] h-[56px] rounded-[28px] ml-[26px]">
              <Image
                src="/icons/star.svg"
                alt="decorative image"
                width={56}
                height={56}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection