import { apiBaseUrl } from "../config";
import type { Promotion } from "@/src/types/interface";

// FIX: Added 'token: string' as a parameter
export default async function getPromotions(token: string): Promise<{ success: boolean; count: number; data: Promotion[] }> {
    const response = await fetch(`${apiBaseUrl}/api/promotions`, {
        method: "GET",
        headers: {
            // FIX: Pass the token to the backend so it doesn't block us!
            authorization: `Bearer ${token}` 
        },
        cache: "no-store" 
    });

    if (!response.ok) {
        throw new Error("Failed to fetch promotions");
    }

    return response.json();
}