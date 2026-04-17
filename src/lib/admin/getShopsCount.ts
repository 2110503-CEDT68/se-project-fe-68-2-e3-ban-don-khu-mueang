import { apiBaseUrl } from "../config";

async function getShopsCount(token: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/massages?limit=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching shops count: ${response.status}`);
        }

        const json = await response.json();
        console.log("Shops count response:", json);
        return json.totalCount;
    } catch (error) {
        console.error("Error in getShopsCount:", error);
        return 0;
    }
}

export default getShopsCount;