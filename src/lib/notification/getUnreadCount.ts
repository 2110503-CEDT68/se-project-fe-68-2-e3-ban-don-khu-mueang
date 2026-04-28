import { apiBaseUrl } from "../config";

export interface UnreadCountResult {
    success: boolean;
    count: number;
}

export default async function getUnreadCount(token: string): Promise<UnreadCountResult> {
    const response = await fetch(`${apiBaseUrl}/api/notifications/unread-count`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch unread count");
    return response.json();
}
