import getPromotions from "./getPromotions";
import type { Promotion } from "@/src/types/interface";

export async function getMaxActiveDiscount(): Promise<number> {
    try {
        // Pass undefined or an empty string, our new getPromotions handles it safely!
        const response = await getPromotions<Promotion>(); 
        
        if (!response || !response.data) return 0;

        const activePromotions = response.data.filter(promo => promo.isActive);
        if (activePromotions.length === 0) return 0;

        // Find the highest amount
        return Math.max(...activePromotions.map(promo => promo.amount));
    } catch (error) {
        console.error("Failed to calculate max discount:", error);
        return 0;
    }
}