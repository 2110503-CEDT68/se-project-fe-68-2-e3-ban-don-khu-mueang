import Link from "next/link";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";

const exploreLinks = [
  { href: "/", label: "Home", authRequired: false, adminOnly: false },
  {
    href: "/massage-shops",
    label: "Massage Shops",
    authRequired: false,
    adminOnly: false,
  },
  { href: "/privacy-policy", label: "Privacy Policy", authRequired: false, adminOnly: false },
];

const accountLinks = [
  { href: "/mybooking", label: "My Bookings", authRequired: true, adminOnly: false },
  { href: "/history", label: "History", authRequired: true, adminOnly: false },
];

const adminLinks = [
  { href: "/admin", label: "Admin Dashboard", authRequired: true, adminOnly: true },
];

export async function Footer() {
  const { session, isAdmin } = await getSessionAuthContext();

  const visibleLinks = (links: typeof exploreLinks) =>
    links.filter(
      (link) => (!link.authRequired || Boolean(session)) && (!link.adminOnly || isAdmin),
    );

  return (
    <footer className="bg-surface-dim px-6 pb-12 pt-20 lg:px-20">
      <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 ">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 font-headline text-2xl font-bold text-primary">
            <img className="" src="/leaf.svg" alt="" />
            ZenMassage
          </span>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Connecting you to the finest wellness sanctuaries. We believe
            tranquility is a necessity, not a luxury.
          </p>
        </div>

        <div>
          <h4 className="mb-6 font-bold text-on-surface">Explore</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            {visibleLinks(exploreLinks).map((link) => (
              <li key={link.href}>
                <Link className="transition-colors hover:text-primary" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 font-bold text-on-surface">Account</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            {visibleLinks(accountLinks).map((link) => (
              <li key={link.href}>
                <Link className="transition-colors hover:text-primary" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 font-bold text-on-surface">Admin</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            {visibleLinks(adminLinks).map((link) => (
              <li key={link.href}>
                <Link className="transition-colors hover:text-primary" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
        <p className="text-xs text-on-surface-variant">© 2026 ZenMassage by Pikiwedia.</p>
      </div>
    </footer>
  );
}