"use client";

import { useState } from "react";
import { PromotionCard, PromotionItem } from "./promotionCard";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Promotion } from "@/src/types/interface";

// Fallback images since your backend schema doesn't store images
const PROMO_IMAGES = [
  "https://images.unsplash.com/photo-1636717970103-da4e0e875c95?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1620733723572-11c53f73a416?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
];

export function PromotionBanner({ promotions }: { promotions: Promotion[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out inactive ones, and map backend fields to the UI format safely
  const activePromotions = promotions?.filter(p => p.isActive) || [];
  
  const displayPromotions: PromotionItem[] = activePromotions.map((promo, index) => {
    // Dynamically build the description based on conditions
    let conditionText = "";
    if (promo.conditions?.enabled) {
        conditionText = ` Valid for bookings of ${promo.conditions.minReservations} or more.`;
    }

    return {
      id: promo._id,
      tagline: `${promo.amount}% OFF SPECIAL`, 
      title: promo.name, 
      description: `Treat yourself to a moment of stillness. Offer valid until ${new Date(promo.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}.${conditionText}`,
      ctaText: "Find Your Calm",
      ctaLink: "/massage-shops",
      imageUrl: PROMO_IMAGES[index % PROMO_IMAGES.length], 
    };
  });

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayPromotions.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayPromotions.length) % displayPromotions.length);
  };

  // If there are no active promotions, don't show the banner at all
  if (displayPromotions.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-24 mb-12">
      <div className="relative">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] rounded-2xl">
          {/* Main Content Area */}
          <div className="w-full transition-opacity duration-500">
            <PromotionCard promotion={displayPromotions[currentIndex]} />
          </div>
        </div>

        {/* Navigation Arrows (Only show if there is more than 1 promotion) */}
        {displayPromotions.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Promotion"
              className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full glass-nav text-[var(--on-surface)] shadow-[0_8px_32px_rgba(26,28,24,0.05)] border border-[rgba(195,200,194,0.15)] hover:scale-105 transition-transform z-20"
            >
              <ChevronLeftIcon />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Promotion"
              className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full glass-nav text-[var(--on-surface)] shadow-[0_8px_32px_rgba(26,28,24,0.05)] border border-[rgba(195,200,194,0.15)] hover:scale-105 transition-transform z-20"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>
    </section>
  );
}