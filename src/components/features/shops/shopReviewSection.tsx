"use client";

import React, { useRef, useState, MouseEvent } from "react";
import ShopReviewCard from "./shopReviewCard";

import { ReviewData } from "@/src/lib/review/getShopReview";

interface ShopReviewSectionProps {
    reviews?: ReviewData[];
}

export default function ShopReviewSection({ reviews = [] }: ShopReviewSectionProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        if (scrollContainerRef.current) {
            setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
            setScrollLeft(scrollContainerRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const hasReviews = reviews && reviews.length > 0;

    return (
        <section className="py-12">
            {/* 
              Title
            */}
            <div className="mb-5">
                <h2 className="font-headline text-3xl text-on-surface">
                    Voices of Our Guests
                </h2>
                <p className="mt-2 font-sans text-on-surface/70">
                    Discover the experiences of those who have found tranquility with us.
                </p>
            </div>

            {hasReviews ? (
                <div
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex w-full gap-8 overflow-x-auto pb-16 pt-4 scroll-pl-6 md:scroll-pl-12 lg:scroll-pl-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
                        }`}
                >
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className={`w-[85vw] shrink-0 sm:w-[400px] ${isDragging ? "pointer-events-none" : "snap-start"
                                }`}
                        >
                            <ShopReviewCard
                                name={review.user?.name || "Anonymous Guest"}
                                profilePic={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || "A")}&background=4e6053&color=fff&size=150`}
                                rating={review.rating}
                                comment={review.comment}
                                date={new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            />
                        </div>
                    ))}
                    {/* Add a spacer at the end for consistent padding during scroll */}
                    <div className="w-[1px] shrink-0 sm:w-[20vw]"></div>
                </div>
            ) : (
                <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-[#4e6053]/20 bg-[#D3E8D7]/10 py-12">
                    <p className="font-sans text-lg text-[#1a1c18]/60">No Review</p>
                </div>
            )}
        </section>
    );
}