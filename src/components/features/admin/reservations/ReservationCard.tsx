"use client";

import Image from "next/image";
import type { AdminReservation } from "@/src/types/api";
import {
	getUserMeta,
	getMassageMeta,
	getStatus,
	toDatetimeLocal,
} from "./reservationUtils";
import { getUserAvatarUrl } from "@/src/lib/avatar";

type ReservationCardProps = {
	reservation: AdminReservation;
	updateReservationAction: (formData: FormData) => void | Promise<void>;
	deleteReservationAction: (formData: FormData) => void | Promise<void>;
};

export default function ReservationCard({
	reservation,
	updateReservationAction,
	deleteReservationAction,
}: ReservationCardProps) {
	const editId = `edit-reservation-${reservation._id}`;
	const userMeta = getUserMeta(reservation.user);
	console.log("User meta:", userMeta);
	const userAvatar = getUserAvatarUrl(userMeta.avatarUrl, userMeta.avatarSeed);
	const massageMeta = getMassageMeta(reservation.massage);
	const reserveDate = new Date(reservation.reserveDate);
	const status = getStatus(reservation.reserveDate, reservation.isRated);

	return (
		<div
			className="group flex flex-col gap-6 rounded-4xl border border-outline-variant/5 bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md xl:flex-row xl:items-center xl:gap-10"
		>
			<div className="shrink-0 rounded-2xl bg-primary-fixed px-4 py-3 text-center text-primary xl:w-20">
				<p className="text-xs font-bold uppercase tracking-tighter">
					{Number.isNaN(reserveDate.getTime())
						? "---"
						: reserveDate.toLocaleDateString(undefined, {
							month: "short",
						})}
				</p>
				<p className="font-headline text-3xl">
					{Number.isNaN(reserveDate.getTime())
						? "--"
						: reserveDate.getDate()}
				</p>
			</div>

			<div className="grid grow grid-cols-1 gap-6 xl:grid-cols-12 xl:items-center xl:gap-8">
				<div className="xl:col-span-3">
					<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
						Guest
					</p>
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-on-secondary-container">
							<Image
								src={userAvatar}
								alt="User avatar"
								width={40}
								height={40}
								className="h-10 w-10 rounded-full object-cover"
							/>
						</div>
						<div>
							<p className="font-semibold text-on-surface">{userMeta.name}</p>
							<p className="text-xs text-on-surface-variant">
								{userMeta.email} · {userMeta.tel}
							</p>
						</div>
					</div>
				</div>

				<div className="lg:col-span-3">
					<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
						Location
					</p>
					<p className="text-sm font-medium text-on-surface">
						{massageMeta.name}
					</p>
					<p className="text-xs text-on-surface-variant">
						{massageMeta.province} · {massageMeta.tel}
					</p>
				</div>

				<div className="lg:col-span-2">
					<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
						Status
					</p>
					<span className={status.className}>{status.label}</span>
				</div>

				<div className="lg:col-span-2">
					<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
						Feedback
					</p>
					<p className="text-sm text-on-surface">
						{reservation.isRated
							? `${reservation.rating ?? "-"}/5`
							: "Not rated"}
					</p>
					<p className="text-xs text-on-surface-variant">
						{Number.isNaN(reserveDate.getTime())
							? "Invalid date"
							: reserveDate.toLocaleString()}
					</p>
				</div>

				<div className="lg:col-span-2 lg:flex lg:justify-end">
					<div className="flex items-center gap-2">
						<input id={editId} type="checkbox" className="peer hidden" />
						<label
							htmlFor={editId}
							className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
						>
							Update
						</label>

						<details className="relative">
							<summary className="cursor-pointer list-none rounded-full border border-error px-4 py-2 text-sm font-semibold text-error hover:bg-error hover:text-on-error">
								Delete
							</summary>
							<div className="absolute right-0 top-11 z-20 w-72 rounded-xl border border-outline-variant/30 bg-surface-container p-3 shadow-sm">
								<p className="text-xs text-on-surface">
									Delete this reservation permanently?
								</p>
								<div className="mt-3 flex justify-end">
									<form action={deleteReservationAction}>
										<input
											type="hidden"
											name="reservationId"
											value={reservation._id}
										/>
										<button
											type="submit"
											className="rounded-full bg-error px-3 py-1.5 text-xs font-semibold text-on-error"
										>
											Confirm
										</button>
									</form>
								</div>
							</div>
						</details>

						<div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100">
							<div className="w-full max-w-xl rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
								<div className="mb-4 flex items-center justify-between">
									<h5 className="font-headline text-xl text-on-surface">
										Edit Reservation
									</h5>
									<label
										htmlFor={editId}
										className="cursor-pointer rounded-full border border-outline-variant/30 px-3 py-1 text-xs text-on-surface-variant"
									>
										Close
									</label>
								</div>

								<div className="mb-4 rounded-xl bg-surface p-3 text-sm text-on-surface-variant">
									<p className="font-medium text-on-surface">{massageMeta.name}</p>
									<p>User: {userMeta.name}</p>
								</div>

								<form action={updateReservationAction} className="space-y-4">
									<input
										type="hidden"
										name="reservationId"
										value={reservation._id}
									/>
									<input
										type="datetime-local"
										name="reserveDate"
										defaultValue={toDatetimeLocal(reservation.reserveDate)}
										className="w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm"
										required
									/>
									<div className="flex justify-end gap-2">
										<label
											htmlFor={editId}
											className="cursor-pointer rounded-full border border-outline-variant/30 px-5 py-2 text-sm text-on-surface-variant"
										>
											Cancel
										</label>
										<button
											type="submit"
											className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
										>
											Save
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}