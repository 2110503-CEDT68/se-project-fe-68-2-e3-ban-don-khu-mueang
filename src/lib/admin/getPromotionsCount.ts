import { apiBaseUrl } from "../config";

async function getPromotionsCount(token: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/promotions?limit=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching promotions count: ${response.status}`);
        }

        const json = await response.json();
        console.log("Promotions count response:", json.count);
        //filter out the promotions.data that isActive is false
        const activePromotions = json.data.filter((promo: any) => promo.isActive);
        console.log("Active promotions count:", activePromotions.length);
        return activePromotions.length;
    } catch (error) {
        console.error("Error in getPromotionsCount:", error);
        return 0;
    }
}

export default getPromotionsCount;