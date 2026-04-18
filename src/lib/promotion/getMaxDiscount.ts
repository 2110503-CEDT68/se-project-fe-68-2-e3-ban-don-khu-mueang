import { getPromotions } from "./getPromotions";

export type PromotionItem = {
    _id: string;
    name: string;
    amount: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
};

export async function getMaxActiveDiscount(): Promise<number> {
    try {
        const response = await getPromotions<PromotionItem>();
        if (!response || !response.success || !response.data) return 0;

        let maxDiscount = 0;
        const now = new Date();

        for (const promo of response.data) {
            if (!promo.isActive) continue;

            const start = new Date(promo.startDate);
            const end = new Date(promo.endDate);

            if (now >= start && now <= end) {
                if (promo.amount > maxDiscount) {
                    maxDiscount = promo.amount;
                }
            }
        }

        return maxDiscount;
    } catch (error) {
        console.error("Error calculating max active discount:", error);
        return 0;
    }
}
