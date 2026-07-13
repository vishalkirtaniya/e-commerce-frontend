"use client";

import { useState } from "react";
import { ProductImage } from "./types";

interface Props {
  images: ProductImage[];
}

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="w-full lg:w-[52%]">
      {/* Main Image */}
      <div className="w-full h-[320px] sm:h-[450px] lg:h-[530px] rounded-[20px] overflow-hidden bg-[#f0f0f0]">
        <img
          src={selectedImage.src}
          alt="Selected Product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelectedImage(img)}
            className={`
              flex-shrink-0
              w-[86px]
              h-[86px]
              sm:w-[110px]
              sm:h-[110px]
              rounded-[16px]
              overflow-hidden
              bg-[#f0f0f0]
              border-2
              transition-all
              ${
                selectedImage.id === img.id
                  ? "border-black"
                  : "border-transparent"
              }
            `}
          >
            <img src={img.src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
