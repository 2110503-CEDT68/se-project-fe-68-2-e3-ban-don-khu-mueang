import { apiBaseUrl } from "../config";

export interface ReviewUser {
    _id: string;
    name: string;
}

export interface ReviewData {
    _id: string;
    rating: number;
    comment?: string; // Made this optional just in case!
    user: ReviewUser;
    massage: string;
    reservation?: string;
    createdAt: string;
}

export interface ShopReviewResponse {
    success: boolean;
    count: number;
    data: ReviewData[];
}

export default async function getShopReview(id: string): Promise<ShopReviewResponse | null> {
    try {
        const response = await fetch(`${apiBaseUrl}/api/massages/${id}/reviews`, {
            method: "GET",
            cache: "no-store", // <--- FIXED: Prevents the caching bug!
        });

        if (!response.ok) {
            throw new Error(`Unable to fetch reviews for shop ID ${id}`);
        }

        const data = (await response.json()) as ShopReviewResponse;
        return data;
    } catch (error) {
        console.error(`Error fetching reviews for shop ID ${id}:`, error);
        return null;
    }
}