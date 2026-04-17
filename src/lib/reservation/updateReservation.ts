import { apiBaseUrl } from "../config";

export default async function updateReservation(id: string, reserveDate: string, token: string) {
    const response = await fetch(`${apiBaseUrl}/api/reservations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reserveDate })
    });

    if (!response.ok) {
        throw new Error("Failed to update reservation");
    }

    return response.json();
}