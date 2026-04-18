"use client";

import { useState } from "react";
import { PromotionCard, PromotionItem } from "./promotionCard";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PROMOTIONS: PromotionItem[] = [
  {
    id: "promo-1",
    tagline: "Spring Offer 20% Off",
    title: "A Moment Of Stillness Awaits",
    description:
      "Immerse yourself in our new seasonal therapies designed to restore balance and elevate your well-being.",
    ctaText: "Find Your Calm",
    ctaLink: "/massage-shops",
    imageUrl: "https://images.unsplash.com/photo-1636717970103-da4e0e875c95?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "promo-2",
    tagline: "New Comer 15% Off",
    title: "Awaken Your Senses",
    description:
      "Reconnect your mind and body with our exclusive botanical remedies, drawn from nature's purest sources.",
    ctaText: "Explore Treatments",
    ctaLink: "/massage-shops",
    imageUrl: "https://images.unsplash.com/photo-1620733723572-11c53f73a416?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function PromotionBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROMOTIONS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PROMOTIONS.length) % PROMOTIONS.length);
  };

  if (PROMOTIONS.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-24 mb-12">
      <div className="relative">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] rounded-2xl">
          {/* Main Content Area */}
          <div className="w-full transition-opacity duration-500">
            <PromotionCard promotion={PROMOTIONS[currentIndex]} />
          </div>
        </div>

        {/* Navigation Arrows */}
        {PROMOTIONS.length > 1 && (
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
