"use client";
import { useState } from 'react';
import { Rating } from '@mui/material';
import rateReservation from '../../../lib/reservation/rateReservation';

interface PastExperienceCardProps {
    id: string;
    massageName: string;
    date: string;
    initialRating?: number;
    token: string;
}

export default function PastExperienceCard({ id, massageName, date, initialRating = 0, token }: PastExperienceCardProps) {
    const [rating, setRating] = useState<number | null>(initialRating || null);
    const [rated, setRated] = useState(Boolean(initialRating));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!rating) return;
        setIsSubmitting(true);
        try {
            await rateReservation(id, rating, token);
            setRated(true);
        } catch (error) {
            console.error("Error submitting rating:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (rated) {
        return (
            <div className="flex flex-col p-6 bg-surface-container opacity-90 rounded-xl w-full">
                <h4 className="font-bold text-base font-sans text-foreground">{massageName}</h4>
                <span className="text-xs text-on-surface-variant">Completed: {date}</span>

                <div className="flex flex-col gap-2 mt-4">
                    <div className="flex gap-1">
                        <Rating name={`read-only-rating-${id}`} value={rating} readOnly size="small" className="text-secondary" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-6 bg-surface-container border border-[rgba(195,200,194,0.05)] rounded-xl w-full transition-transform hover:-translate-y-1 hover:shadow-sm">
            <h4 className="font-bold text-base font-sans text-foreground">{massageName}</h4>
            <span className="text-xs text-on-surface-variant mb-4">Completed: {date}</span>

            <div className="flex flex-col p-4 gap-3 bg-surface-container-lowest rounded-lg w-full">
                <span className="font-semibold text-xs uppercase text-secondary tracking-wide">Rate your session</span>
                <div className="flex gap-2">
                    <Rating
                        name={`session-rating-${id}`}
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        className="text-secondary"
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!rating || isSubmitting}
                    className="text-xs font-bold text-primary underline w-fit hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </div>
    );
}
