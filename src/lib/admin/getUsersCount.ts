import { apiBaseUrl } from "../config";

async function getUsersCount(token: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/users?limit=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching users count: ${response.status}`);
        }

        const json = await response.json();
        console.log("Users count response:", json);
        return json.totalCount;
    } catch (error) {
        console.error("Error in getUsersCount:", error);
        return 0;
    }
}

export default getUsersCount;