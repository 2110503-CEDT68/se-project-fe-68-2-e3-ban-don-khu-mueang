import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "@/src/lib/auth/getUserProfile";

const getSessionAuthContext = cache(async () => {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token ?? null;

    let profile: Awaited<ReturnType<typeof getUserProfile>> = null;
    let isAdmin = false;

    if (token) {
        profile = await getUserProfile(token);
        isAdmin = profile?.data?.role === "admin";
    }

    return {
        session,
        token,
        profile,
        isAdmin,
    };
});

export default getSessionAuthContext;