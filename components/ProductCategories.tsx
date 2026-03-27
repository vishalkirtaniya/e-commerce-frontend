"use client";
import Image from "next/image";

const ProductCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Casual",
      image: "/images/casual.png",
      className: "w-full sm:w-[36%]",
    },
    {
      id: 2,
      name: "Formal",
      image: "/images/formal.png",
      className: "w-full sm:w-[calc(64%-10px)]",
    },
    {
      id: 3,
      name: "Party",
      image: "/images/party.png",
      className: "w-full sm:w-[calc(64%-10px)]",
    },
    {
      id: 4,
      name: "Gym",
      image: "/images/gym.png",
      className: "w-full sm:w-[36%]",
    },
  ];

  return (
    <section className="w-full bg-secondary-background mt-[96px] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1240px] mx-auto bg-[#f0f0f0] rounded-[20px]">
        <div className="flex flex-col gap-[64px] justify-center items-center py-[62px]">
          {/* Section Title */}
          <h2 className="text-[36px] sm:text-[48px] font-bold leading-[41px] sm:leading-[55px] text-center text-text-primary font-aclonica">
            Products We Make
          </h2>

          {/* Categories Grid */}
          <div className="flex flex-col gap-[20px] justify-start items-center w-full max-w-[1110px]">
            {/* First Row */}
            <div className="flex flex-col sm:flex-row gap-[20px] justify-start items-center w-full">
              {categories.slice(0, 2).map((category) => (
                <div
                  key={category.id}
                  className={`relative ${category.className} bg-secondary-background rounded-[20px] overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={category.id === 1 ? 406 : 684}
                    height={288}
                    className="w-full h-[200px] sm:h-[288px] object-cover rounded-[20px]"
                  />
                  <div className="absolute top-[24px] left-[36px]">
                    <h3 className="text-[28px] sm:text-[36px] font-bold leading-[38px] sm:leading-[49px] text-left text-text-primary font-satoshi">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row */}
            <div className="flex flex-col sm:flex-row gap-[20px] justify-start items-center w-full">
              {categories.slice(2, 4).map((category) => (
                <div
                  key={category.id}
                  className={`relative ${category.className} bg-secondary-background rounded-[20px] overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={category.id === 3 ? 642 : 354}
                    height={288}
                    className="w-full h-[200px] sm:h-[288px] object-cover rounded-[20px]"
                  />
                  <div className="absolute top-[24px] left-[36px]">
                    <h3 className="text-[28px] sm:text-[36px] font-bold leading-[38px] sm:leading-[49px] text-left text-text-primary font-satoshi">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
