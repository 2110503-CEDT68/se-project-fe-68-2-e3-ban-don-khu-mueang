import { apiBaseUrl } from "../config";

async function getTopRatedShops(shops: number) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/massages?sort=-averageRating&limit=${shops}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${shops} top-rated shops:`, error);
        return null;
    }
}

export default getTopRatedShops;