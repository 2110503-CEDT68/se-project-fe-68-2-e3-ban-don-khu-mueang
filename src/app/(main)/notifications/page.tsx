import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";
import NotificationsPageContent from "@/src/components/features/notifications/NotificationsPageContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NotificationsPage() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if (!token) {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center px-6 py-16">
                <div className="w-full rounded-3xl border border-[rgba(195,200,194,0.35)] bg-surface-container-lowest p-8 text-center shadow-[0_8px_30px_rgb(26_28_24/0.04)]">
                    <h1 className="font-headline text-3xl text-foreground">Notifications</h1>
                    <p className="mt-3 text-sm text-on-surface-variant">
                        Sign in to view your notifications.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
            <header className="flex flex-col gap-4">
                <h1 className="font-headline text-[56px] leading-[1.05] text-primary">
                    Notifications
                </h1>
                <p className="max-w-2xl text-base leading-7 text-on-surface-variant">
                    Stay up to date with shop closures, promotions, and important updates
                    about your bookings.
                </p>
            </header>

            <NotificationsPageContent token={token} />
        </div>
    );
}
