"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import getUnreadCount from "@/src/lib/notification/getUnreadCount";
import NotificationPanel from "./NotificationPanel";
import NotificationsIcon from '@mui/icons-material/Notifications';

interface NotificationBellProps {
    token: string;
}

export default function NotificationBell({ token }: NotificationBellProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Poll for unread count using long polling interval
    const fetchUnreadCount = useCallback(async () => {
        try {
            const result = await getUnreadCount(token);
            setUnreadCount(result.count);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    }, [token]);

    useEffect(() => {
        // Defer initial fetch to avoid synchronous setState in effect body (React 19)
        const timeoutId = setTimeout(fetchUnreadCount, 0);

        // Long polling: check every 30 seconds
        const intervalId = setInterval(fetchUnreadCount, 30000);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [fetchUnreadCount]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUnreadCountChange = useCallback((count: number) => {
        setUnreadCount(count);
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-flex">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                aria-expanded={isOpen}
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-on-surface-variant transition-colors duration-150 hover:bg-surface-container-high"
            >
                <NotificationsIcon className="text-2xl" />

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex min-w-[18px] items-center justify-center rounded-full bg-error px-1 text-[11px] font-bold leading-none text-on-error shadow-[0_0_0_2px_var(--surface-container-lowest)] animate-[badge-pop_0.3s_ease-out]"
                        style={{ height: "18px" }}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 z-100 animate-[panel-slide-in_0.2s_ease-out]">
                    <NotificationPanel
                        token={token}
                        onUnreadCountChange={handleUnreadCountChange}
                    />
                </div>
            )}
        </div>
    );
}
