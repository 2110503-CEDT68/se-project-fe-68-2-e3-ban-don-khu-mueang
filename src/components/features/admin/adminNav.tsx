"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavProps = {
  mobile?: boolean;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "/layout-dashboard.svg" },
  { href: "/admin/shops", label: "Manage Shops", icon: "/store.svg" },
  { href: "/admin/reservations", label: "All Reservations", icon: "/calendar-range.svg" },
  { href: "/admin/users", label: "User Management", icon: "/users.svg" },
  { href: "/admin/promotions", label: "Promotion", icon: "/badge-check.svg" },
];

function isNavItemActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav({ mobile = false }: AdminNavProps) {
  const pathname = usePathname();
  const activeBase = mobile
    ? "bg-surface-container text-primary"
    : "bg-surface-container-lowest text-primary";
  const inactiveBase = mobile
    ? "text-on-surface-variant hover:bg-surface-container"
    : "text-on-surface-variant hover:bg-surface-container-high";
  const baseClass = mobile
    ? "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
    : "flex items-center gap-4 rounded-xl px-4 py-3 transition-colors";

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const linkClass = `${active ? activeBase : inactiveBase} ${baseClass} ${active ? "font-semibold" : ""}`;

        return (
          <Link key={item.href} href={item.href} className={linkClass}>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
            >
              <img src={item.icon} alt="" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
