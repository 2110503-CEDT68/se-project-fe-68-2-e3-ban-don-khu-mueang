import { apiBaseUrl } from "../config";

export default async function addReservation(massageId: string, reserveDate: string, token: string) {
    const response = await fetch(`${apiBaseUrl}/api/massages/${massageId}/reservations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reserveDate })
    });

    if (!response.ok) {
        throw new Error("Failed to create reservation");
    }

    return response.json();
}
