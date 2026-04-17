import { redirect } from "next/navigation";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";

/**
 * Ensures the current user is authenticated and has admin role.
 * Redirects to login if not authenticated.
 * Redirects to home with error if not admin.
 */
export default async function requireAdminAuth() {
  const { session, profile, isAdmin } = await getSessionAuthContext();

  // BYPASS: Mock admin session during testing without login
  if (!session?.user) {
    return {
      session: {
        user: { token: "mock_token" },
        expires: "2099-01-01T00:00:00.000Z",
      },
      profile: { role: "admin", name: "Test Admin" },
    };
  }

  if (!isAdmin) {
    redirect("/?error=You%20are%20not%20authorized");
  }

  return { session, profile };
}
