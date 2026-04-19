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

// Notice the ? after token. It means token is optional!
export async function getPromotions<T>(token?: string) {
    try {
        // Only create the headers object if we actually have a token
        const headers: HeadersInit = {};
        if (token) {
            headers["authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${apiBaseUrl}/api/promotions`, {
            method: "GET",
            headers: headers, // <--- Use the dynamic headers
            cache: "no-store", 
        });

        if (!response.ok) {
            throw new Error(`Unable to fetch promotions (Status: ${response.status})`);
        }

        const data = (await response.json()) as ApiListResponse<T>;
        return data;
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return null; // Return null so the page doesn't crash!
    }
}

export default getPromotions;