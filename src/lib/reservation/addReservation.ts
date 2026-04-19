import { apiBaseUrl } from "../config";

export default async function addReservation(
    massageId: string,
    reserveDate: string,
    price: number,
    netPrice: number,
    discount: { name: string; amount: number }[], // Added discount array
    token: string
) {
    if (isNaN(price) || isNaN(netPrice) || price === null || netPrice === null) {
        throw new Error("Price calculation error. Please refresh and try again.");
    }

    const response = await fetch(`${apiBaseUrl}/api/massages/${massageId}/reservations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        // Include the discount array in the request body
        body: JSON.stringify({ reserveDate, price, netPrice, discount }) 
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create reservation");
    }

    return response.json();
}