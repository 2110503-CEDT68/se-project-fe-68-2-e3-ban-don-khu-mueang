import { apiBaseUrl } from "../config";

export default async function rateReservation(id: string, rating: number, token: string) {
    const response = await fetch(`${apiBaseUrl}/api/reservations/${id}/rate`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating })
    });

    if (!response.ok) {
        throw new Error("Failed to submit rating");
    }

    return response.json();
}