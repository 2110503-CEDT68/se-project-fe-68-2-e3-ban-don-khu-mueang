import { apiBaseUrl } from "../config";

export default async function deleteReview(reviewId: string, token: string) {
    const response = await fetch(`${apiBaseUrl}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
    }

    return response.json();
}