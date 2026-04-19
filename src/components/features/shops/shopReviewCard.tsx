import { Rating } from '@mui/material';
import React from 'react';

interface ShopReviewCardProps {
    profilePic?: string;
    name?: string;
    rating?: number;
    comment?: string;
    date?: string;
}

export default function ShopReviewCard({
    profilePic = "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    name = "Jane Doe",
    rating = 4.5,
    comment = "This place is amazing! Absolutely loved the ambiance and the service was top-notch. Will definitely come back.",
    date = "2 days ago"
}: ShopReviewCardProps) {
    return (
        <div className="group flex max-w-[450px] flex-col gap-6 rounded-2xl bg-[#D3E8D7]/30 p-6 shadow-[0_8px_32px_0_rgba(26,28,24,0.05)] transition-all duration-700 ease-in-out hover:-translate-y-1">

            <div className="flex items-center gap-5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#4e6053] to-[#66796b] p-[2px]">
                    <img
                        src={profilePic}
                        alt={`${name}'s profile picture`}
                        className="h-full w-full rounded-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="m-0 font-sans text-[1.15rem] font-medium text-[#1a1c18]">{name}</h3>
                    <span className="font-sans text-sm tracking-wide text-[#1a1c18]/60">{date}</span>
                </div>
            </div>

            <div className="transition-transform duration-700 ease-in-out group-hover:translate-x-1">
                <Rating name="read-only" value={rating} precision={0.5} readOnly size="medium" sx={{ color: '#4e6053' }} />
            </div>

            <div className="relative mt-2 rounded-xl bg-[#f9faf3] p-5 transition-colors duration-700 ease-in-out group-hover:bg-[#eeeee8]">
                <span className="absolute -left-2 -top-5 z-0 font-serif text-6xl leading-none text-[#4e6053]/10">"</span>
                <p className="relative z-10 m-0 font-sans text-[0.95rem] leading-relaxed text-[#1a1c18]/80">
                    {comment}
                </p>
            </div>
        </div>
    );
}