"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getUserAvatarUrl } from "@/src/lib/avatar";
import NotificationBell from "./NotificationBell";

const dropdownMenuLinks = [
  { href: "/admin", label: "Admin Dashboard", authRequired: true, adminOnly: true },
  { href: "/profile", label: "My Profile", authRequired: true },
];

interface UserAuthNavProps {
  profile: {
    data: {
      name: string;
      picture?: string;
      avatarUrl?: string | null; // Added to match your usage below
      _id?: string;
      email?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  } | null;
  isAdmin: boolean;
  token: string | null;
}

export default function UserAuthNav({ profile, isAdmin, token }: UserAuthNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Kept the properly typed ref, removed the duplicate
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarSrc = getUserAvatarUrl(
    profile?.data?.avatarUrl,
    profile?.data?._id ?? profile?.data?.email ?? profile?.data?.name ?? "user"
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (profile) {
    return (
      <div className="flex items-center gap-4">
        <span className="hidden text-sm font-medium text-on-surface sm:inline">
          Welcome, {profile.data.name.split(" ")[0]}
        </span>

        {token && <NotificationBell token={token} />}
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-expanded={isOpen}
          >
            <Image
              src={avatarSrc}
              alt="User avatar"
              width={256}
              height={256}
              className="rounded-full w-12 h-12 object-cover"
            />
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl bg-surface-container-lowest py-2 shadow-[0_8px_32px_rgb(26_28_24/0.08)] transition-all duration-200">
              
              {/* Only show the link if it's NOT adminOnly, OR if the user IS an admin */}
              {dropdownMenuLinks.map((link, index) => {
                if (link.adminOnly && !isAdmin) return null;
                
                return (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                  >
                    {link.label}
                  </Link>
                );
              })}

              <hr className="my-1 border-surface-container-highest opacity-50" />

              <Link
                href="/logout"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-error transition-colors hover:bg-error/10"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-on-primary shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1),0_8px_32px_rgb(26_28_24/0.05)] transition-all hover:opacity-90 active:scale-95"
    >
      Sign In
    </Link>
  );
}