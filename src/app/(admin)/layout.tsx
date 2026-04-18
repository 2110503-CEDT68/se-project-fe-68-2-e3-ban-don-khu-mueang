import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect, notFound, unauthorized, forbidden } from "next/navigation";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";
import AdminNav from "../../components/features/admin/adminNav";

export default async function AdminLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { session, profile, isAdmin } = await getSessionAuthContext();

	if (!session?.user) {
		redirect("/login?callbackUrl=/admin");
	} else if (!isAdmin) {
		// redirect("/");
		// unauthorized();
		forbidden();
	}

	return (
		<div className="bg-background text-on-surface flex min-h-screen flex-col lg:flex-row">
			<aside className="bg-surface-container hidden w-72 shrink-0 flex-col border-r border-outline-variant/10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
				<div className="p-8">
					<h1 className="font-headline text-primary text-2xl font-bold">
						ZenMassage Admin
					</h1>
					<p className="text-on-surface-variant mt-1 text-xs tracking-widest">
						Verdant Sanctuary System
					</p>
				</div>

				<div className="mt-4 flex-1 px-4 pb-6">
					<AdminNav showHomeAtBottom />
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="glass-nav relative z-1200 flex h-16 items-center justify-between border-b border-outline-variant/10 px-4 sm:h-20 sm:px-6 lg:px-10">
					<div className="flex items-center gap-3">
						<details className="group relative z-1300 lg:hidden">
							<summary className="text-on-surface-variant hover:bg-surface-container-high flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full transition-colors [&::-webkit-details-marker]:hidden">
								<span className="sr-only">Open admin navigation</span>
								<span className="material-symbols-outlined group-open:hidden">
									<img src="/menu.svg" alt="" />
								</span>
							</summary>
							<div className="bg-surface-container-lowest absolute top-12 left-0 z-1400 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-outline-variant/20 p-3 shadow-sm">
								<AdminNav mobile showHomeAtBottom />
							</div>
						</details>
					</div>

					<div className="flex items-center gap-3">
						<div className="bg-outline-variant/20 mx-1 hidden h-8 w-px sm:block"></div>
						<details className="group relative z-1300">
							<summary className="flex list-none cursor-pointer items-center gap-2 rounded-full p-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 [&::-webkit-details-marker]:hidden">
								{/* User Name and role */}
								<div className="mr-2 ml-2 flex-col text-right sm:block">
									<p className="text-sm font-medium text-on-surface">
										{profile?.data?.name ?? "Admin"}
									</p>
									<p className="text-xs text-on-surface-variant">
										{profile?.data?.role ?? "admin"}
									</p>
								</div>
								<Image
									src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${profile?.data?._id ?? "admin"}`}
									alt="User avatar"
									width={40}
									height={40}
									className="h-10 w-10 rounded-full object-cover"
								/>
							</summary>
							<div className="invisible absolute right-0 z-1400 mt-2 w-48 overflow-hidden rounded-xl bg-surface-container-lowest py-2 opacity-0 shadow-[0_8px_32px_rgb(26_28_24/0.08)] transition-all duration-200 group-open:visible group-open:opacity-100">
								<Link
									href="/logout"
									className="block px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
								>
									Logout
								</Link>
							</div>
						</details>
					</div>
				</header>

				{children}
			</div>
		</div>
	);
}
