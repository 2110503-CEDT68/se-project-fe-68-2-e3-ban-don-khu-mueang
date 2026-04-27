import { apiBaseUrl } from "../config";

export default async function markAllAsRead(
    token: string
): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${apiBaseUrl}/api/notifications/read-all`, {
        method: "PUT",
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error("Failed to mark all notifications as read");
    return response.json();
}
