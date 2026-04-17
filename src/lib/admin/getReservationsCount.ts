import { apiBaseUrl } from "../config";

async function getReservationsCount(token: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/reservations?limit=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching reservations count: ${response.status}`);
        }

        const json = await response.json();
        // console.log("Reservations count response:", json);
        return json.totalCount;
    } catch (error) {
        console.error("Error in getReservationsCount:", error);
        return 0;
    }
}

export default getReservationsCount;