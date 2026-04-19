import { apiBaseUrl } from "../config";

export default async function deletePromotion(id: string, token: string) {
    const response = await fetch(`${apiBaseUrl}/api/promotions/${id}`, {
        method: "DELETE",
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete promotion");
    }

    return response.json();
}