import { apiBaseUrl } from "../config";

export interface NotificationItem {
    _id: string;
    user: string;
    type: 'shop_closed' | 'promotion_new' | 'promotion_expiring';
    title: string;
    message: string;
    isRead: boolean;
    metadata: {
        shopId?: string;
        shopName?: string;
        promotionId?: string;
        promotionName?: string;
        reservationId?: string;
        expiryDate?: string;
    };
    createdAt: string;
}

export interface NotificationListResult {
    success: boolean;
    count: number;
    totalCount: number;
    pagination?: {
        next?: { page: number; limit: number };
        prev?: { page: number; limit: number };
    };
    data: NotificationItem[];
}

export default async function getNotifications(
    token: string,
    page: number = 1,
    limit: number = 25
): Promise<NotificationListResult> {
    const response = await fetch(
        `${apiBaseUrl}/api/notifications?page=${page}&limit=${limit}`,
        {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) throw new Error("Failed to fetch notifications");
    return response.json();
}
