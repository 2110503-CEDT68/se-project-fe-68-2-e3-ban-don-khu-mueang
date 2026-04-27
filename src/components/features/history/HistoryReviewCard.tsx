"use client";

import { useState } from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import { Pencil, Trash2, X } from "lucide-react";
import rateReservation from "@/src/lib/reservation/rateReservation";
import updateReview from "@/src/lib/review/updateReview"; 
import deleteReview from "@/src/lib/review/deleteReview"; 
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal";

interface HistoryReviewCardProps {
    id: string; // The Reservation ID
    reviewId?: string; // The Review ID (if it exists)
    massageName: string;
    imageSrc: string;
    reserveDate?: string;
    completedOn: string;
    price?: number;
    netPrice?: number;
    discount?: { name: string; amount: number; percentage?: number }[];
    province?: string;
    tel?: string;
    createdAt?: string;
    token: string;
    initialRating?: number;
    initialComment?: string;
}

export default function HistoryReviewCard({
    id,
    reviewId,
    massageName,
    imageSrc,
    reserveDate,
    completedOn,
    price,
    netPrice,
    discount = [],
    province,
    tel,
    createdAt,
    token,
    initialRating = 0,
    initialComment = "",
}: HistoryReviewCardProps) {
    const [rating, setRating] = useState<number | null>(initialRating || null);
    const [comment, setComment] = useState(initialComment);
    
    // Track the last successfully saved values so we can revert if the user clicks "Cancel"
    const [lastSavedRating, setLastSavedRating] = useState<number | null>(initialRating || null);
    const [lastSavedComment, setLastSavedComment] = useState(initialComment);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(Boolean(initialRating || initialComment));
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeView, setActiveView] = useState<"review" | "detail">("review");

    // Track if it exists in the UI, AND track the actual database ID
    const [isExistingReview, setIsExistingReview] = useState(Boolean(initialRating));
    const [currentReviewId, setCurrentReviewId] = useState<string | undefined>(reviewId);
    const formatBaht = (amount?: number) => (typeof amount === "number" ? `฿${amount.toFixed(2)}` : "-");
    const dateObj = reserveDate ? new Date(reserveDate) : null;
    const hasValidReserveDate = Boolean(dateObj && !Number.isNaN(dateObj.getTime()));
    const formattedReserveDate = hasValidReserveDate
        ? dateObj!.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "-";
    const formattedReserveTime = hasValidReserveDate
        ? dateObj!.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        : "-";
    const hasPromos = discount.length > 0;

    const persistReview = async () => {
        if (isSaved || !rating) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const safeComment = comment || "";
            const trimmedComment = safeComment.trim();

            if (currentReviewId) {
                await updateReview(currentReviewId, rating, token, trimmedComment || undefined);
            } else {
                const response = await rateReservation(id, rating, token, trimmedComment || undefined);
                setIsExistingReview(true); 
                
                if (response && response.data && response.data._id) {
                    setCurrentReviewId(response.data._id);
                }
            }

            setIsSaved(true);
            
            // Update the backup state so future cancels revert to this newly saved data
            setLastSavedRating(rating);
            setLastSavedComment(trimmedComment);

            if (trimmedComment !== safeComment) {
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

    const handleCancelEdit = () => {
        // Revert to the last saved data and close the edit mode
        setRating(lastSavedRating);
        setComment(lastSavedComment);
        setIsSaved(true);
        setSubmitError(null);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const executeDelete = async () => {
        setShowDeleteModal(false); 
        setIsSubmitting(true);
        setSubmitError(null);

        if (!currentReviewId) {
            setRating(null);
            setComment("");
            setLastSavedRating(null);
            setLastSavedComment("");
            setIsSaved(false);
            setIsExistingReview(false); 
            setIsSubmitting(false);
            return;
        }

        try {
            await deleteReview(currentReviewId, token); 
            
            setRating(null);
            setComment("");
            setLastSavedRating(null);
            setLastSavedComment("");
            setIsSaved(false);
            setIsExistingReview(false); 
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
            <article className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-[rgba(195,200,194,0.28)] bg-surface-container shadow-[0_8px_24px_rgb(26_28_24/0.04)]">
                <div className="grid gap-0 lg:grid-cols-[1fr_2fr] lg:h-130">
                    <div className="relative h-80 bg-surface-container-lowest lg:h-full">
                        <Image
                            src={imageSrc}
                            alt={massageName}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 34vw, 100vw"
                        />
                    </div>

                    <div className="flex flex-col gap-4 p-6 lg:p-8 lg:overflow-y-auto">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-headline text-2xl leading-tight text-foreground">{massageName}</h3>
                            <p className="text-sm text-on-surface-variant">Completed on {completedOn}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveView("review")}
                                className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors ${activeView === "review"
                                    ? "bg-primary text-on-primary"
                                    : "border border-[rgba(195,200,194,0.45)] bg-white text-foreground hover:bg-surface-container-lowest"
                                    }`}
                            >
                                Review
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveView("detail")}
                                className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors ${activeView === "detail"
                                    ? "bg-primary text-on-primary"
                                    : "border border-[rgba(195,200,194,0.45)] bg-white text-foreground hover:bg-surface-container-lowest"
                                    }`}
                            >
                                Detail
                            </button>
                        </div>

                        <div className="flex h-90 flex-col rounded-2xl border border-[rgba(195,200,194,0.35)] bg-white p-4 lg:p-5 overflow-hidden">
                            {activeView === "detail" ? (
                                <div className="flex flex-col overflow-y-auto h-full">
                                    <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-secondary shrink-0">Promotion Details</h4>

                                    <div className="mt-3 grid grid-cols-2 gap-2 overflow-y-auto flex-1">
                                        <div className="rounded-xl bg-surface-container-lowest px-3 py-2.5">
                                            <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Date</p>
                                            <p className="mt-1 text-sm font-semibold text-foreground">{formattedReserveDate}</p>
                                        </div>
                                        <div className="rounded-xl bg-surface-container-lowest px-3 py-2.5">
                                            <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Time</p>
                                            <p className="mt-1 text-sm font-semibold text-foreground">{formattedReserveTime}</p>
                                        </div>
                                        <div className="rounded-xl bg-surface-container-lowest px-3 py-2.5">
                                            <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Price</p>
                                            <p className="mt-1 text-sm font-semibold text-foreground">{formatBaht(price)}</p>
                                        </div>
                                        <div className="rounded-xl bg-surface-container-lowest px-3 py-2.5">
                                            <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Paid</p>
                                            <p className="mt-1 text-sm font-semibold text-foreground">{formatBaht(netPrice)}</p>
                                        </div>
                                        {province && (
                                            <div className="rounded-xl bg-surface-container-lowest px-3 py-2.5">
                                                <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Province</p>
                                                <p className="mt-1 text-sm font-semibold text-foreground">{province}</p>
                                            </div>
                                        )}
                                        {tel && (
                                            <div className="rounded-xl bg-surface-container-lowest px-3 py-2.5">
                                                <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Phone</p>
                                                <p className="mt-1 text-sm font-semibold text-foreground">{tel}</p>
                                            </div>
                                        )}
                                    </div>

                                    {hasPromos && (
                                        <div className="mt-3 rounded-xl bg-primary-container/30 px-3 py-2.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Promotions</p>
                                                {/* <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
                                                    {discount.length}
                                                </span> */}
                                            </div>
                                            <ul className="mt-2 max-h-14 space-y-1 overflow-hidden">
                                                {discount.map((item, index) => (
                                                    <li key={`${item.name}-${index}`} className="flex items-center justify-between text-xs text-foreground">
                                                        <span className="truncate pr-2">
                                                            {item.name}
                                                            {typeof item.percentage === "number" && ` (${item.percentage.toFixed(2)}%)`}
                                                        </span>
                                                        <span className="shrink-0 font-semibold">-{formatBaht(item.amount)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {createdAt && (
                                        <p className="mt-auto pt-3 text-xs text-on-surface-variant shrink-0">
                                            Booking Date: {new Date(createdAt).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col h-full gap-3">
                                    <div className="grid grid-cols-2 gap-2 shrink-0">
                                        <div className="rounded-xl bg-surface-container-lowest px-3 py-2.5">
                                            <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Rating</p>
                                            <div className="mt-1 flex h-8 items-center">
                                                <Rating
                                                    name={`history-rating-${id}`}
                                                    value={rating}
                                                    onChange={(_, newValue) => setRating(newValue)}
                                                    className="text-secondary"
                                                    disabled={isSubmitting || isSaved}
                                                />
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-surface-container-lowest px-3 py-2.5 text-right">
                                            <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Status</p>
                                            <p className="mt-1 text-sm font-semibold text-foreground">
                                                {isSaved ? "Review Submitted" : "Ready to submit"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-hidden flex flex-col gap-2 min-h-0">
                                        <label className="flex flex-col gap-2 flex-1 min-h-0">
                                            <span className="text-xs font-bold uppercase tracking-[0.12em] text-secondary shrink-0">Review note</span>
                                            <textarea
                                                value={comment || ""}
                                                onChange={(event) => setComment(event.target.value)}
                                                placeholder="Write a short note about your experience..."
                                                className="flex-1 rounded-xl border border-[rgba(195,200,194,0.45)] bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary disabled:opacity-60 resize-none"
                                                disabled={isSubmitting || isSaved}
                                            />
                                        </label>

                                        {submitError && <p className="text-xs font-medium text-red-700 shrink-0">{submitError}</p>}
                                    </div>

                                        <div className="flex items-end justify-end gap-2 shrink-0">
                                            {!isSaved ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={persistReview}
                                                        disabled={isSubmitting || !rating}
                                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? "Submitting..." : "Submit"}
                                                    </button>
                                                    {isExistingReview && (
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            disabled={isSubmitting}
                                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <X size={16} /> Cancel
                                                        </button>
                                                    )}
                                                </>
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
                            )}
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