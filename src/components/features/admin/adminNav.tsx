"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavProps = {
  mobile?: boolean;
  showHomeAtBottom?: boolean;
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
  { href: "/admin/reviews",label: "All Reviews", icon: "/star.svg"}, 
];

function isNavItemActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav({ mobile = false, showHomeAtBottom = true }: AdminNavProps) {
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
  const homeActive = pathname === "/";
  const homeClass = `${homeActive ? activeBase : inactiveBase} ${baseClass} ${homeActive ? "font-semibold" : ""}`;
  const containerClass = showHomeAtBottom && !mobile ? "flex h-full flex-col" : "space-y-2";
  const homeSectionClass = showHomeAtBottom
    ? mobile
      ? "mt-3 border-t border-outline-variant/20 pt-3"
      : "mt-auto border-t border-outline-variant/20 pt-4"
    : "";

  return (
    <nav className={containerClass}>
      <div className="space-y-2">
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
      </div>

      {showHomeAtBottom && (
        <div className={homeSectionClass}>
          <Link href="/" className={homeClass}>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: homeActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              <img src="/window.svg" alt="" />
            </span>
            Home Page
          </Link>
        </div>
      )}
    </nav>
  );
}
