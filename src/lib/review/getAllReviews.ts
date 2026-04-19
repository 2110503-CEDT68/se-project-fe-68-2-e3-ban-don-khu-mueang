import { apiBaseUrl } from "../config";

export default async function getAllReviews(token: string) {
    const response = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Crucial for admin pages: bypass cache so you always see fresh data
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch all reviews");
    }

    return response.json();
}