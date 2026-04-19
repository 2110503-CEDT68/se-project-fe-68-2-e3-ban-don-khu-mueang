"use client";

import { useState } from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import rateReservation from "@/src/lib/reservation/rateReservation";
import updateReview from "@/src/lib/review/updateReview"; 
import deleteReview from "@/src/lib/review/deleteReview"; 
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal";

interface HistoryReviewCardProps {
    id: string;
    reviewId?: string; // The ID passed down from the parent
    massageName: string;
    imageSrc: string;
    completedOn: string;
    token: string;
    initialRating?: number;
    initialComment?: string;
}

export default function HistoryReviewCard({
    id,
    reviewId,
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
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isExistingReview, setIsExistingReview] = useState(Boolean(initialRating));
    
    // FIX 1: Turn reviewId into a state variable so we can update it without a refresh
    const [currentReviewId, setCurrentReviewId] = useState<string | undefined>(reviewId);

    const persistReview = async () => {
        const trimmedComment = comment.trim();

        if (isSaved || !rating) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (isExistingReview) {
                // UPDATE
                await updateReview(id, rating, token, trimmedComment || undefined);
            } else {
                // CREATE
                const response = await rateReservation(id, rating, token, trimmedComment || undefined);
                setIsExistingReview(true); 
                
                // FIX 2: Capture the newly generated ID from the backend response and save it!
                // (Adjust this path if your backend returns the ID slightly differently, e.g., response._id)
                if (response && response.data && response.data._id) {
                    setCurrentReviewId(response.data._id);
                }
            }

            const nextSavedAt = new Date().toISOString();
            setIsSaved(true);
            setSavedAt(nextSavedAt);

            if (trimmedComment !== comment) {
                setComment(trimmedComment);
            }
        } catch (error) {
            console.error("Error saving review:", error);
            setSubmitError(error instanceof Error ? error.message : "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = () => {
        setIsSaved(false);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const executeDelete = async () => {
        setShowDeleteModal(false); 
        setIsSubmitting(true);
        setSubmitError(null);

        // FIX 3: Use the STATE variable (currentReviewId) instead of the PROP
        if (!currentReviewId) {
            setSubmitError("Cannot delete: Review ID is missing. Please refresh.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Pass currentReviewId here
            await deleteReview(currentReviewId, token); 
            
            setRating(null);
            setComment("");
            setIsSaved(false);
            setSavedAt(null);
            setIsExistingReview(false); 
            
            // FIX 4: Clear the ID so it's ready for a brand new review if they change their mind
            setCurrentReviewId(undefined);
            
        } catch (error) {
            console.error("Error deleting review:", error);
            setSubmitError(error instanceof Error ? error.message : "Failed to delete review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <> 
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
                                    {isSaved ? "Review Submitted" : "Submit Review"}
                                </span>
                                {savedAt ? (
                                    <span className="text-xs font-medium text-on-surface-variant">
                                        Last saved {new Date(savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                ) : isSaved ? (
                                    <span className="text-xs font-medium text-on-surface-variant">
                                        Review submitted
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
                                disabled={isSubmitting || isSaved}
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
                                    className="min-h-[108px] rounded-xl border border-[rgba(195,200,194,0.45)] bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary disabled:opacity-60"
                                    disabled={isSubmitting || isSaved}
                                />
                            </label>

                            {submitError && (
                                <p className="text-xs font-medium text-red-700">{submitError}</p>
                            )}

                            <div className="flex flex-wrap gap-3">
                                {!isSaved ? (
                                    <button
                                        type="button"
                                        onClick={persistReview}
                                        disabled={isSubmitting || !rating}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleEdit}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Pencil size={16} /> Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2 size={16} /> {isSubmitting ? "Deleting..." : "Delete"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onConfirm={executeDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}