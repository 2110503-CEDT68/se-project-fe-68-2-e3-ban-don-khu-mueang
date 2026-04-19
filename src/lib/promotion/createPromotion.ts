import { apiBaseUrl } from "../config";
import type { Promotion } from "@/src/types/interface";

export default async function createPromotion(promoData: Partial<Promotion>, token: string) {
    const response = await fetch(`${apiBaseUrl}/api/promotions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(promoData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create promotion");
    }

    return response.json();
}