import { apiBaseUrl } from "../config";

export interface ReviewReservationRef {
    _id?: string;
}

export interface ReviewItem {
    _id: string;
    reservation: string | ReviewReservationRef;
    rating: number;
    comment?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ReviewResult {
    success: boolean;
    count: number;
    data: ReviewItem[];
}

export default async function getReviews(token: string): Promise<ReviewResult> {
    const response = await fetch(`${apiBaseUrl}/api/reviews/me`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch my reviews");
    }

    return response.json();
}
