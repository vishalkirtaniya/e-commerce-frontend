"use client";

import Image from "next/image";

const ProductCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Casual",
      image: "/images/casual.png",
      desktopWidth: "lg:w-[36%]",
    },
    {
      id: 2,
      name: "Formal",
      image: "/images/formal.png",
      desktopWidth: "lg:w-[64%]",
    },
    {
      id: 3,
      name: "Party",
      image: "/images/party.png",
      desktopWidth: "lg:w-[64%]",
    },
    {
      id: 4,
      name: "Gym",
      image: "/images/gym.png",
      desktopWidth: "lg:w-[36%]",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mt-12 lg:mt-24">
      <div className="max-w-[1240px] mx-auto bg-[#f0f0f0] rounded-[24px] px-4 sm:px-8 lg:px-16 py-10 lg:py-16">
        {/* Title */}
        <h2 className="font-integral text-[32px] leading-[36px] lg:text-[48px] lg:leading-[58px] font-bold text-center text-black">
          BROWSE BY
          <br className="lg:hidden" /> DRESS STYLE
        </h2>

        {/* Grid */}
        <div className="mt-10 lg:mt-16 flex flex-col gap-5">
          {/* Row 1 */}
          <div className="flex flex-col lg:flex-row gap-5">
            {categories.slice(0, 2).map((category) => (
              <div
                key={category.id}
                className={`relative w-full ${category.desktopWidth} h-[190px] lg:h-[289px] rounded-[20px] overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-all`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover object-right"
                />

                <h3 className="absolute top-6 left-6 z-10 text-[24px] lg:text-[36px] font-bold text-black">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-col lg:flex-row gap-5">
            {categories.slice(2, 4).map((category) => (
              <div
                key={category.id}
                className={`relative w-full ${category.desktopWidth} h-[190px] lg:h-[289px] rounded-[20px] overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-all`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover object-right"
                />

                <h3 className="absolute top-6 left-6 z-10 text-[24px] lg:text-[36px] font-bold text-black">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
