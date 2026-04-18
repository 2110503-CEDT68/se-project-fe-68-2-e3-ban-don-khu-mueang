import { apiBaseUrl } from "../config";

export default async function rateReservation(
    reservationId: string,
    rating: number,
    token: string,
    comment?: string
) {
    const payload: { reservation: string; rating: number; comment?: string } = {
        reservation: reservationId,
        rating,
    };
    if (typeof comment === "string" && comment.trim().length > 0) {
        payload.comment = comment.trim();
    }

    const response = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        let errorMessage = "Failed to submit review";

        try {
            const errorBody = await response.json() as { message?: string; error?: string };
            errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch {
            // Keep default message if response has no JSON body
        }

        throw new Error(errorMessage);
    }

    return response.json();
}