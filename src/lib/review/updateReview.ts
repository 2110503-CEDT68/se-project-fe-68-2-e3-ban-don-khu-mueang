import { apiBaseUrl } from "../config";


export default async function updateReview(id: string, rating: number, token: string, comment?: string) {
    const payload: { rating: number; comment?: string } = { rating };
    
    if (typeof comment === "string" && comment.trim().length > 0) {
        payload.comment = comment.trim();
    }

    const response = await fetch(`${apiBaseUrl}/api/reviews/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        let errorMessage = "Failed to update review";
        try {
            const errorBody = await response.json() as { message?: string; error?: string };
            errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch { }
        throw new Error(errorMessage);
    }

    return response.json();
}