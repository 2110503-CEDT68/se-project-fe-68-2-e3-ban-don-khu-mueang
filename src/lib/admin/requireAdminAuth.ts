import { redirect } from "next/navigation";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";

/**
 * Ensures the current user is authenticated and has admin role.
 * Redirects to login if not authenticated.
 * Redirects to home with error if not admin.
 */
export default async function requireAdminAuth() {
  const { session, profile, isAdmin } = await getSessionAuthContext();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!isAdmin) {
    redirect("/?error=You%20are%20not%20authorized");
  }

  return { session, profile };
}
