import { apiBaseUrl } from "../config";

async function getReviewsCount(token: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/reviews?limit=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching reviews count: ${response.status}`);
        }

        const json = await response.json();
        return json.totalCount;
    } catch (error) {
        console.error("Error in getReviewsCount:", error);
        return 0;
    }
}

export default getReviewsCount;