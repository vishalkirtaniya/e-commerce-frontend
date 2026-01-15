"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "./types";

interface Props {
  images: ProductImage[];
}

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState<ProductImage>(
    images[0]
  );

  return (
    <div className="flex flex-col md:flex-row gap-[14px] w-full lg:w-[55%]">
      {/* Thumbnail Images */}
      <div className="flex md:flex-col gap-[14px] order-2 md:order-1 w-full md:w-[24%]">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelectedImage(img)}
            className={`w-full md:w-[152px] h-[120px] md:h-[166px] rounded-[20px] overflow-hidden bg-secondary-dark border-2 transition-all ${
              selectedImage.id === img.id
                ? "border-text-primary scale-105"
                : "border-transparent hover:scale-105"
            }`}
          >
            <Image
              src={img.src}
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
          src={selectedImage.src}
          alt="Selected product image"
          width={444}
          height={530}
          className="w-full h-full object-cover transition-all duration-300"
          priority
        />
      </div>
    </div>
  );
}
