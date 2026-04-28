import { apiBaseUrl } from "../config";

export default async function markAsRead(
    token: string,
    notificationId: string
): Promise<{ success: boolean }> {
    const response = await fetch(
        `${apiBaseUrl}/api/notifications/${notificationId}/read`,
        {
            method: "PUT",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error("Failed to mark notification as read");
    return response.json();
}
