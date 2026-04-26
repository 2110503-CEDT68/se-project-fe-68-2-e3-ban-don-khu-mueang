import getCurrentGreeting from "@/src/lib/getCurrentGreeting";
import getShopsCount from "@/src/lib/admin/getShopsCount";
import getReservationsCount from "@/src/lib/admin/getReservationsCount";
import Link from "next/link";
import getUsersCount from "@/src/lib/admin/getUsersCount";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import getPromotionsCount from "@/src/lib/admin/getPromotionsCount";

export default async function AdminDashboardPage() {
  const { session, profile } = await requireAdminAuth();
  const token = session?.user?.token;
  let shopsCount = 0;
  let reservationsCount = 0;
  let usersCount = 0;
  let promotionsCount = 0;

  if (token) {
    shopsCount = await getShopsCount(token);
    reservationsCount = await getReservationsCount(token);
    usersCount = await getUsersCount(token);
    promotionsCount = await getPromotionsCount(token);
  }

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:space-y-12 lg:p-10">
        <section className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <h3 className="text-on-surface font-headline text-3xl sm:text-4xl">
              {getCurrentGreeting()},{" "}
              {profile?.data?.name?.split(" ")[0] ?? "Admin"}.
            </h3>
            <p className="text-on-surface-variant max-w-md">
                Here&apos;s a snapshot of your massage shops ecosystem&apos;s performance and activity.
              </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-surface-container-lowest flex flex-col justify-between rounded-4xl border border-outline-variant/10 p-6 shadow-sm sm:p-8">
            <div className="bg-secondary-container text-secondary mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
              <span
                className="material-symbols-outlined"
              >
                <img src="/leaf.svg" alt="" />
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-medium">
                Active Shops
              </p>
              <h4 className="font-headline mt-1 text-3xl font-bold">
                {shopsCount}
              </h4>
              {/* <p className="text-on-surface-variant mt-2 text-xs">
                Across 4 regions
              </p> */}
              <div className="mt-4 flex justify-end">
                <Link 
                  href="/admin/shops"
                  className="bg-primary text-on-primary rounded-full px-8 py-3 font-medium shadow-sm transition-opacity hover:opacity-90"
                >
                  Manage Shops
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest flex flex-col justify-between rounded-4xl border border-outline-variant/10 p-6 shadow-sm sm:p-8">
            <div className="bg-primary-fixed text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
              <span
                className="material-symbols-outlined"
              >
                <img src="/calendar-range.svg" alt="" />
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-medium">
                Total Reservations
              </p>
              <h4 className="font-headline mt-1 text-3xl font-bold">{reservationsCount}</h4>
              {/* <p className="text-on-surface-variant mt-2 text-xs">
                  Target reached: 92%
                </p> */}
                <div className="mt-4 flex justify-end">
                <Link 
                  href="/admin/reservations"
                  className="bg-primary text-on-primary rounded-full px-8 py-3 font-medium shadow-sm transition-opacity hover:opacity-90"
                >
                  Manage Reservations
                </Link>
              </div>
            </div>

          </div>

          
          <div className="bg-surface-container-lowest flex flex-col justify-between rounded-4xl border border-outline-variant/10 p-6 shadow-sm sm:p-8">
            <div className="bg-primary-fixed text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
              <span
                className="material-symbols-outlined"
              >
                <img src="/users.svg" alt="" />
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-medium">
                Total Users
              </p>
              <h4 className="font-headline mt-1 text-3xl font-bold">{usersCount}</h4>
              {/* <p className="text-on-surface-variant mt-2 text-xs">
                  Target reached: 92%
                </p> */}
                <div className="mt-4 flex justify-end">
                <Link 
                  href="/admin/users"
                  className="bg-primary text-on-primary rounded-full px-8 py-3 font-medium shadow-sm transition-opacity hover:opacity-90"
                >
                  Manage Users
                </Link>
              </div>
            </div>

          </div>

          <div className="bg-surface-container-lowest flex flex-col justify-between rounded-4xl border border-outline-variant/10 p-6 shadow-sm sm:p-8">
            <div className="bg-primary-fixed text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
              <span
                className="material-symbols-outlined"
              >
                <img src="/users.svg" alt="" />
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-medium">
                Total Active Promotions
              </p>
              <h4 className="font-headline mt-1 text-3xl font-bold">{promotionsCount}</h4>
              {/* <p className="text-on-surface-variant mt-2 text-xs">
                  Target reached: 92%
                </p> */}
                <div className="mt-4 flex justify-end">
                <Link 
                  href="/admin/promotions"
                  className="bg-primary text-on-primary rounded-full px-8 py-3 font-medium shadow-sm transition-opacity hover:opacity-90"
                >
                  Manage Promotions
                </Link>
              </div>
            </div>

          </div>
        </section>

      </main>
    </>
  );
}
