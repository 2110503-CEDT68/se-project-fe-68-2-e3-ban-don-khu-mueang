"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import rateReservation from "@/src/lib/reservation/rateReservation";

interface HistoryReviewCardProps {
    id: string;
    massageName: string;
    imageSrc: string;
    completedOn: string;
    token: string;
    initialRating?: number;
    initialComment?: string;
}

interface SavedReview {
    rating: number | null;
    comment: string;
    savedAt: string;
}

const getStorageKey = (id: string) => `reservation-review-${id}`;

export default function HistoryReviewCard({
    id,
    massageName,
    imageSrc,
    completedOn,
    token,
    initialRating = 0,
    initialComment = "",
}: HistoryReviewCardProps) {
    const [rating, setRating] = useState<number | null>(initialRating || null);
    const [comment, setComment] = useState(initialComment);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(Boolean(initialRating || initialComment));
    const [savedAt, setSavedAt] = useState<string | null>(null);

    useEffect(() => {
        const storageKey = getStorageKey(id);
        const rawValue = window.localStorage.getItem(storageKey);

        if (!rawValue) {
            return;
        }

        try {
            const parsedValue = JSON.parse(rawValue) as SavedReview;
            setRating(parsedValue.rating);
            setComment(parsedValue.comment);
            setIsSaved(true);
            setSavedAt(parsedValue.savedAt);
        } catch (error) {
            console.error("Failed to read saved review:", error);
        }
    }, [id]);

    const persistReview = async () => {
        const trimmedComment = comment.trim();

        if (!rating && !trimmedComment) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (rating) {
                await rateReservation(id, rating, token);
            }

            const nextSavedAt = new Date().toISOString();
            window.localStorage.setItem(
                getStorageKey(id),
                JSON.stringify({
                    rating,
                    comment: trimmedComment,
                    savedAt: nextSavedAt,
                })
            );

            setIsSaved(true);
            setSavedAt(nextSavedAt);
        } catch (error) {
            console.error("Error saving review:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <article className="overflow-hidden rounded-3xl border border-[rgba(195,200,194,0.28)] bg-surface-container shadow-[0_8px_24px_rgb(26_28_24/0.04)]">
            <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
                <div className="relative min-h-[220px] bg-surface-container-lowest">
                    <Image
                        src={imageSrc}
                        alt={massageName}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 220px, 100vw"
                    />
                </div>

                <div className="flex flex-col gap-5 p-6">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-headline text-xl text-foreground">{massageName}</h3>
                        <p className="text-sm text-on-surface-variant">Completed on {completedOn}</p>
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-4">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">
                                {isSaved ? "Edit Review" : "Submit Review"}
                            </span>
                            {savedAt ? (
                                <span className="text-xs font-medium text-on-surface-variant">
                                    Last saved {new Date(savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-on-surface-variant">
                                    Ready to submit
                                </span>
                            )}
                        </div>

                        <Rating
                            name={`history-rating-${id}`}
                            value={rating}
                            onChange={(_, newValue) => setRating(newValue)}
                            className="text-secondary"
                            disabled={isSubmitting}
                        />

                        <label className="flex flex-col gap-2">
                            <span className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">
                                Comment
                            </span>
                            <textarea
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                rows={4}
                                placeholder="Write a short note about your experience..."
                                className="min-h-[108px] rounded-xl border border-[rgba(195,200,194,0.45)] bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary"
                                disabled={isSubmitting}
                            />
                        </label>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={persistReview}
                                disabled={isSubmitting || (!rating && !comment.trim())}
                                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : isSaved ? "Submit Changes" : "Submit Review"}
                            </button>
                            <button
                                type="button"
                                disabled
                                className="inline-flex items-center justify-center rounded-full border border-[rgba(195,200,194,0.6)] bg-white px-5 py-2.5 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                disabled
                                className="inline-flex items-center justify-center rounded-full border border-[rgba(195,200,194,0.6)] bg-white px-5 py-2.5 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}