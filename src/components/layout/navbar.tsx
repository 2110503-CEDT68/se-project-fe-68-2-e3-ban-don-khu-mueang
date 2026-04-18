import Link from "next/link";
import Image from "next/image";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";
import UserNavigation from "./LayoutComponents/UserNavigation"

const navLinks = [
  { href: "/", label: "Home", authRequired: false, adminOnly: false },
  { href: "/massage-shops", label: "Massage Shops", authRequired: false, adminOnly: false },
  { href: "/mybooking", label: "My Bookings", authRequired: true, adminOnly: false },
  { href: "/history", label: "History", authRequired: true, adminOnly: false },
];

export async function Navbar() {
  const { session, profile, isAdmin } = await getSessionAuthContext();

  return (
    <nav className="glass-nav sticky top-0 z-50 px-6 py-4 lg:px-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-12">
          <details className="group relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-center rounded-full p-2 text-on-surface transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Toggle navigation menu</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6 group-open:hidden"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="hidden h-6 w-6 group-open:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </summary>
            <div className="absolute left-0 top-full mt-3 flex w-[min(20rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl bg-surface-container-lowest p-3 shadow-[0_8px_32px_rgb(26_28_24/0.05)]">
              {navLinks.map((link, index) => {
                if ((link.authRequired && !session) || (link.adminOnly && !isAdmin)) return null;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="block rounded-lg px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </details>

          <Link
            href="/"
            className="font-headline text-2xl font-bold tracking-tight text-primary"
          >
            ZenMassage
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link, index) => {
              if ((link.authRequired && !session) || (link.adminOnly && !isAdmin)) return null;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <UserNavigation profile={profile} />
        
      </div>
    </nav>
  );
}