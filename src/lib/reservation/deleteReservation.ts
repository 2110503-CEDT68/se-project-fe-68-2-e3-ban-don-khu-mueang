import { apiBaseUrl } from "../config";

export default async function deleteReservation(id: string, token: string) {
    const response = await fetch(`${apiBaseUrl}/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to cancel reservation");
    }

    return response.json();
}