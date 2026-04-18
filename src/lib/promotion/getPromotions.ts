import { apiBaseUrl } from "../config";

type ApiListResponse<T> = {
    success: boolean;
    count: number;
    totalCount: number;
    pagination: {
        next?: { page: number; limit: number };
        prev?: { page: number; limit: number };
    };
    data: T[];
};

export async function getPromotions<T>() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/promotions`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error('Unable to fetch promotions');
        }

        const data = (await response.json()) as ApiListResponse<T>;
        return data;
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return null;
    }
}

export default getPromotions;
