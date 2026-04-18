'use client';

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import addReservation from "@/src/lib/reservation/addReservation";

function BookingForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const shopId = searchParams.get('id');
    const shopName = searchParams.get('name') || "Selected Shop";
    const shopPrice = Number(searchParams.get('price')) || 0;
    const discount = Number(searchParams.get('discount')) || 15; // Set a default discount or read from searchParams

    const [reserveDate, setReserveDate] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = useSession();

    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const minDateTime = getCurrentDateTimeLocal();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shopId || !reserveDate) return;

        const selectDate = new Date(reserveDate);
        const currentDate = new Date();
        if (selectDate < currentDate) {
            alert("Please select a date and time in the future.");
            return;
        }

        const token = session?.user?.token;
        if (!token) {
            alert("Please sign in to book a massage.");
            return router.push(`/login?callbackUrl=${encodeURIComponent(`/booking?id=${shopId}&name=${shopName}&price=${shopPrice}`)}`);
        }

        setIsSubmitting(true);
        try {
            await addReservation(shopId, new Date(reserveDate).toISOString(), token);
            router.push("/mybooking");
            router.refresh();
        } catch (error) {
            console.error("Failed to add reservation:", error);
            alert("Failed to confirm booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Field 1: Show current massage shop name */}
            <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-[0.6px] text-[#737873]">
                    current Shop name
                </label>
                <div className="flex h-[58px] items-center rounded-xl border border-[#C3C8C2] bg-white px-5">
                    <p>{shopName}</p>
                </div>
            </div>

            {/* Field 2: Pick Your Date & Time */}
            <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-[0.6px] text-[#737873]">
                    1. Pick Your Date & Time
                </label>
                <div className="flex h-[58px] items-center rounded-xl border border-[#C3C8C2] bg-white px-5">
                    <input
                        type="datetime-local"
                        value={reserveDate}
                        onChange={(e) => setReserveDate(e.target.value)}
                        min={minDateTime}
                        required
                        className="w-full border-none bg-transparent font-['Manrope'] text-base text-[#1A1C18] outline-none focus:ring-0"
                    />
                </div>
            </div>

            {/* Pricing Summary */}
            <div className="flex flex-col gap-4 border-t border-[#C3C8C2]/30 pt-8">
                <div className="flex items-center justify-between text-sm text-[#434843]">
                    <span>Subtotal</span>
                    <span className="font-['Roboto'] text-lg font-semibold text-[#1A1C18]">
                        ฿{shopPrice.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#4E6053]">
                    <span>Promotion Discount</span>
                    <span className="font-['Roboto'] text-lg font-semibold text-[#4E6053]">
                        -฿{discount.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#434843]">
                    <span>Taxes & Fees</span>
                    <span className="font-['Roboto'] text-lg font-semibold text-[#1A1C18]">
                        ฿12.00
                    </span>
                </div>

                {/* Total Row */}
                <div className="flex items-center justify-between border-t border-[#C3C8C2]/10 pt-4 text-base font-bold text-[#1A1C18]">
                    <span>Total</span>
                    <span className="font-['Noto_Serif'] text-2xl font-bold">
                        ฿{Math.max(0, shopPrice - discount + 12).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-6 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex h-[68px] w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#4E6053] font-['Manrope'] text-lg font-bold text-white shadow-[0_10px_15px_-3px_rgba(78,96,83,0.1),0_4px_6px_-4px_rgba(78,96,83,0.1)] transition-opacity hover:opacity-90 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    <span>{isSubmitting ? 'Confirming...' : 'Confirm Booking'}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.55px] text-[#737873]">
                    <svg
                        width="10"
                        height="12"
                        viewBox="0 0 10 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect y="4" width="10" height="8" rx="2" fill="#737873" />
                        <path d="M2 4V3C2 1.34315 3.34315 0 5 0C6.65685 0 8 1.34315 8 3V4" stroke="#737873" strokeWidth="2" />
                    </svg>
                    Secure Payment
                </div>
            </div>
        </form>
    );
}

export default function Booking() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-white">
            <div className="box-border flex w-full max-w-[576px] flex-col gap-10 rounded-2xl border border-[#C3C8C2] bg-[#F3F4ED] p-12 pb-16 font-['Manrope'] shadow-sm">
                {/* Header */}
                <header className="flex flex-col items-center gap-3 text-center">
                    <h1 className="m-0 font-['Noto_Serif'] text-4xl font-normal leading-tight text-[#1A1C18]">
                        Book Your Massage
                    </h1>
                    <p className="m-0 text-sm text-[#434843]">
                        Please select your preferences below to secure your spot.
                    </p>
                </header>

                <Suspense fallback={<div className="text-center text-sm text-[#434843]">Loading form...</div>}>
                    <BookingForm />
                </Suspense>
            </div>
        </div>
    );
}