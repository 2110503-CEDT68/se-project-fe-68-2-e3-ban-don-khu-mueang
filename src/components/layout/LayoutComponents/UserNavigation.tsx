"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const dropdownMenuLinks = [
  { href: "/admin", label: "Admin Dashboard", authRequired: true, adminOnly: true },
  { href: "/profile", label: "My Profile", authRequired: true },
];

// Add isAdmin to the destructured props
export default function UserAuthNav({ profile, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-expanded={isOpen}
          >
            <Image
              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${profile.data._id}`}
              alt="User avatar"
              width={40}
              height={40}
              // unoptimized
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