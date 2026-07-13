"use client";

import { useState } from "react";
import { Review } from "./types";
import RatingBar from "@/components/ui/RatingBar";
import Button from "@/components/ui/Button";

type Tab = "details" | "reviews" | "faq";

export default function ProductTabs({
  description,
  reviews,
}: {
  description: string;
  reviews: Review[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [visibleReviews, setVisibleReviews] = useState(2);

  return (
    <section className="mt-12 lg:mt-16">
      <div className="flex overflow-x-auto border-b mb-6 scrollbar-hide">
        {["details", "reviews", "faq"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`flex-1 min-w-[120px] py-3 text-center capitalize ${
              activeTab === tab
                ? "border-b-2 border-black font-medium"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <p className="text-gray-600 max-w-3xl">{description}</p>
      )}

      {activeTab === "reviews" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div key={review.id} className="border rounded-xl p-6">
                <RatingBar rating={review.rating} />
                <h4 className="font-semibold mt-2">{review.name}</h4>
                <p className="text-gray-500 mt-2">“{review.comment}”</p>
                <p className="text-sm text-gray-400 mt-2">{review.date}</p>
              </div>
            ))}
          </div>

          {visibleReviews < reviews.length && (
            <div className="mt-6 text-center">
              <Button
                text="Load More Reviews"
                onClick={() => setVisibleReviews((v) => v + 2)}
              />
            </div>
          )}
        </>
      )}

      {activeTab === "faq" && (
        <p className="text-gray-600">No FAQs available for this product yet.</p>
      )}
    </section>
  );
}
