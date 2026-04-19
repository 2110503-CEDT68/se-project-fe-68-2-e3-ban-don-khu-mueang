import { apiBaseUrl } from "../config";
import type { Promotion } from "@/src/types/interface";

export default async function updatePromotion(id: string, promoData: Partial<Promotion>, token: string) {
    const response = await fetch(`${apiBaseUrl}/api/promotions/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(promoData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update promotion");
    }

    return response.json();
}