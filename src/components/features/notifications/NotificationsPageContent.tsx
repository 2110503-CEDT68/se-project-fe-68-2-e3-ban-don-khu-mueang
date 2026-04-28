"use client";

import { useState, useEffect, useCallback } from "react";
import type { NotificationItem } from "@/src/lib/notification/getNotifications";
import getNotifications from "@/src/lib/notification/getNotifications";
import markAsRead from "@/src/lib/notification/markAsRead";
import markAllAsRead from "@/src/lib/notification/markAllAsRead";
import NotificationsOffOutlined from "@mui/icons-material/NotificationsOffOutlined";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import TimerOutlined from "@mui/icons-material/TimerOutlined";

function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
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

function getFilterIcon(value: string): React.ReactElement {
    const sx = { fontSize: "18px" };
    switch (value) {
        case "shop_closed":
            return <StorefrontOutlined sx={sx} />;
        case "promotion_new":
            return <LocalOfferOutlined sx={sx} />;
        case "promotion_expiring":
            return <TimerOutlined sx={sx} />;
        default:
            return <NotificationsOutlined sx={sx} />;
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

function getCardBorderClass(type: NotificationItem["type"], isRead: boolean): string {
    if (isRead) return "border-[rgba(195,200,194,0.35)]";
    switch (type) {
        case "shop_closed":
            return "border-error/30";
        case "promotion_new":
            return "border-primary/30";
        case "promotion_expiring":
            return "border-secondary/30";
        default:
            return "border-[rgba(195,200,194,0.35)]";
    }
}

function getTypeLabel(type: NotificationItem["type"]): string {
    switch (type) {
        case "shop_closed":
            return "Shop Closure";
        case "promotion_new":
            return "New Promotion";
        case "promotion_expiring":
            return "Expiring Promotion";
        default:
            return "Notification";
    }
}

type FilterType = "all" | "shop_closed" | "promotion_new" | "promotion_expiring";

interface NotificationsPageContentProps {
    token: string;
}

export default function NotificationsPageContent({
    token,
}: NotificationsPageContentProps) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [filter, setFilter] = useState<FilterType>("all");

    const fetchNotifications = useCallback(
        async (pageNum: number, append: boolean = false) => {
            try {
                if (append) setLoadingMore(true);
                else setLoading(true);

                const result = await getNotifications(token, pageNum, 15);

                if (append) {
                    setNotifications((prev) => [...prev, ...result.data]);
                } else {
                    setNotifications(result.data);
                }

                setTotalCount(result.totalCount);
                setHasMore(!!result.pagination?.next);
                setPage(pageNum);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchNotifications(page + 1, true);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsRead(token, notificationId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                )
            );
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
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        } finally {
            setMarkingAll(false);
        }
    };

    const filtered =
        filter === "all"
            ? notifications
            : notifications.filter((n) => n.type === filter);

    const hasUnread = notifications.some((n) => !n.isRead);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const filterOptions: { value: FilterType; label: string }[] = [
        { value: "all", label: "All" },
        { value: "shop_closed", label: "Shop Closures" },
        { value: "promotion_new", label: "Promotions" },
        {
            value: "promotion_expiring",
            label: "Expiring Soon",
        },
    ];

    return (
        <section className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Filter chips */}
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`flex cursor-pointer items-center gap-1.5 rounded-full border-none px-4 py-2 text-sm font-medium transition-all ${filter === opt.value
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                                }`}
                        >
                            {getFilterIcon(opt.value)}
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {hasUnread && (
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={markingAll}
                            className={`cursor-pointer rounded-full border-none bg-primary-fixed px-4 py-2 text-sm font-semibold text-on-primary-fixed transition-all hover:opacity-90 ${markingAll ? "cursor-default opacity-60" : ""
                                }`}
                        >
                            {markingAll
                                ? "Marking..."
                                : `Mark all as read (${unreadCount})`}
                        </button>
                    )}
                    <span className="text-sm text-on-surface-variant">
                        {totalCount} notification{totalCount !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {/* Notification List */}
            {loading ? (
                <div className="flex items-center justify-center rounded-3xl border border-[rgba(195,200,194,0.35)] bg-surface-container-lowest py-20 shadow-[0_8px_30px_rgb(26_28_24/0.04)]">
                    <span className="text-on-surface-variant">
                        Loading notifications...
                    </span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-[rgba(195,200,194,0.35)] bg-surface-container-lowest py-20 shadow-[0_8px_30px_rgb(26_28_24/0.04)]">
                    <NotificationsOffOutlined className="text-outline-variant" sx={{ fontSize: "48px" }} />
                    <p className="text-on-surface-variant">
                        {filter === "all"
                            ? "No notifications yet"
                            : "No notifications in this category"}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((notification) => (
                        <div
                            key={notification._id}
                            onClick={() => {
                                if (!notification.isRead) {
                                    handleMarkAsRead(notification._id);
                                }
                            }}
                            className={`flex gap-4 rounded-2xl border p-5 transition-all ${getCardBorderClass(notification.type, notification.isRead)
                                } ${notification.isRead
                                    ? "cursor-default bg-surface-container-lowest shadow-[0_2px_8px_rgba(26,28,24,0.02)]"
                                    : "cursor-pointer bg-surface-container-low shadow-[0_4px_16px_rgba(26,28,24,0.06)] hover:bg-surface-container"
                                }`}
                        >
                            {/* Icon */}
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[22px] ${getIconBgClass(notification.type, notification.isRead)
                                    }`}
                            >
                                {getNotificationIcon(
                                    notification.type,
                                    getIconTextClass(notification.type, notification.isRead)
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[15px] text-foreground ${notification.isRead
                                                    ? "font-medium"
                                                    : "font-bold"
                                                    }`}
                                            >
                                                {notification.title}
                                            </span>
                                            {!notification.isRead && (
                                                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <span className="w-fit rounded-md bg-surface-container-high px-2 py-0.5 text-xs font-medium text-on-surface-variant">
                                            {getTypeLabel(notification.type)}
                                        </span>
                                    </div>
                                    <span className="shrink-0 text-xs text-outline">
                                        {getRelativeTime(
                                            notification.createdAt
                                        )}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                                    {notification.message}
                                </p>

                                <span className="mt-1 text-xs text-outline">
                                    {formatDateTime(notification.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Load More */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className={`cursor-pointer rounded-full border border-outline-variant bg-surface-container-low px-6 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-surface-container ${loadingMore ? "cursor-default opacity-60" : ""
                                    }`}
                            >
                                {loadingMore
                                    ? "Loading..."
                                    : "Load more notifications"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
