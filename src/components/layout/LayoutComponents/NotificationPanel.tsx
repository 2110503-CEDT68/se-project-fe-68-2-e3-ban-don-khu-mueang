"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { NotificationItem } from "@/src/lib/notification/getNotifications";
import getNotifications from "@/src/lib/notification/getNotifications";
import markAsRead from "@/src/lib/notification/markAsRead";
import markAllAsRead from "@/src/lib/notification/markAllAsRead";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import TimerOutlined from "@mui/icons-material/TimerOutlined";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import NotificationsOffOutlined from "@mui/icons-material/NotificationsOffOutlined";

function getRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

function getNotificationIcon(type: NotificationItem["type"], className: string): React.ReactElement {
    const sx = { fontSize: "inherit" };
    switch (type) {
        case "shop_closed":
            return <StorefrontOutlined className={className} sx={sx} />;
        case "promotion_new":
            return <LocalOfferOutlined className={className} sx={sx} />;
        case "promotion_expiring":
            return <TimerOutlined className={className} sx={sx} />;
        default:
            return <NotificationsOutlined className={className} sx={sx} />;
    }
}

function getIconTextClass(type: NotificationItem["type"], isRead: boolean): string {
    if (isRead) return "text-on-surface-variant";
    switch (type) {
        case "shop_closed":
            return "text-error";
        case "promotion_new":
            return "text-primary";
        case "promotion_expiring":
            return "text-secondary";
        default:
            return "text-on-surface-variant";
    }
}

function getIconBgClass(type: NotificationItem["type"], isRead: boolean): string {
    if (isRead) return "bg-surface-container";
    switch (type) {
        case "shop_closed":
            return "bg-error/10";
        case "promotion_new":
            return "bg-primary/10";
        case "promotion_expiring":
            return "bg-secondary/10";
        default:
            return "bg-surface-container";
    }
}

function getBorderClass(type: NotificationItem["type"], isRead: boolean): string {
    if (isRead) return "border-l-transparent";
    switch (type) {
        case "shop_closed":
            return "border-l-error";
        case "promotion_new":
            return "border-l-primary";
        case "promotion_expiring":
            return "border-l-secondary";
        default:
            return "border-l-on-surface-variant";
    }
}

interface NotificationPanelProps {
    token: string;
    onUnreadCountChange?: (count: number) => void;
}

export default function NotificationPanel({ token, onUnreadCountChange }: NotificationPanelProps) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const result = await getNotifications(token, 1, 20);
            setNotifications(result.data);
            const unread = result.data.filter((n) => !n.isRead).length;
            onUnreadCountChange?.(unread);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [token, onUnreadCountChange]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsRead(token, notificationId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                )
            );
            const remaining = notifications.filter(
                (n) => !n.isRead && n._id !== notificationId
            ).length;
            onUnreadCountChange?.(remaining);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        setMarkingAll(true);
        try {
            await markAllAsRead(token);
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
            onUnreadCountChange?.(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        } finally {
            setMarkingAll(false);
        }
    };

    const hasUnread = notifications.some((n) => !n.isRead);

    return (
        <div className="flex w-[380px] max-h-[480px] flex-col overflow-hidden rounded-[20px] bg-surface-container-lowest shadow-[0_12px_48px_rgba(26,28,24,0.12)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant px-5 pt-4 pb-3">
                <h3 className="m-0 text-base font-bold text-foreground">
                    Notifications
                </h3>
                <div className="flex items-center gap-2">
                    {hasUnread && (
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={markingAll}
                            className={`cursor-pointer border-none bg-transparent px-2 py-1 text-[13px] font-semibold text-primary rounded-lg transition-colors duration-150 hover:bg-surface-container-low ${markingAll ? "opacity-50 cursor-default" : ""}`}
                        >
                            {markingAll ? "Marking..." : "Mark all read"}
                        </button>
                    )}
                </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center px-5 py-12 text-sm text-on-surface-variant">
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-on-surface-variant">
                        <NotificationsOffOutlined className="text-[40px] opacity-40" sx={{ fontSize: "40px" }} />
                        <span className="text-sm">No notifications yet</span>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            onClick={() => {
                                if (!notification.isRead) {
                                    handleMarkAsRead(notification._id);
                                }
                            }}
                            className={`flex gap-3 border-l-[3px] px-5 py-3.5 transition-colors duration-150 ${
                                getBorderClass(notification.type, notification.isRead)
                            } ${
                                notification.isRead
                                    ? "bg-transparent"
                                    : "cursor-pointer bg-surface-container-low hover:bg-surface-container"
                            }`}
                        >
                            {/* Icon */}
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-xl ${
                                    getIconBgClass(notification.type, notification.isRead)
                                }`}
                            >
                                {getNotificationIcon(
                                    notification.type,
                                    getIconTextClass(notification.type, notification.isRead)
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <span
                                        className={`text-[13px] leading-tight text-foreground ${
                                            notification.isRead ? "font-medium" : "font-bold"
                                        }`}
                                    >
                                        {notification.title}
                                    </span>
                                    {!notification.isRead && (
                                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                    )}
                                </div>
                                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-on-surface-variant">
                                    {notification.message}
                                </p>
                                <span className="mt-1 block text-[11px] text-outline">
                                    {getRelativeTime(notification.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-outline-variant px-5 py-2.5 text-center">
                <Link
                    href="/notifications"
                    className="text-[13px] font-semibold text-primary no-underline hover:underline"
                >
                    View all notifications
                </Link>
            </div>
        </div>
    );
}
