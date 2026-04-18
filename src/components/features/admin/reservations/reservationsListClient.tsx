"use client";

import { useMemo, useState } from "react";
import type { AdminReservation } from "@/src/types/api";
import ReservationsFilter from "./ReservationsFilter";
import ReservationCard from "./ReservationCard";
import { getMassageMeta, getStatus, getDateKey } from "./reservationUtils";

type ReservationsListClientProps = {
	reservations: AdminReservation[];
	totalCount: number;
	hasNextPage: boolean;
	updateReservationAction: (formData: FormData) => void | Promise<void>;
	deleteReservationAction: (formData: FormData) => void | Promise<void>;
};

export default function ReservationsListClient({
	reservations,
	totalCount,
	hasNextPage,
	updateReservationAction,
	deleteReservationAction,
}: ReservationsListClientProps) {
	const [shopFilter, setShopFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState("");
	const [sortBy, setSortBy] = useState("created-desc");

	const shopOptions = useMemo(
		() =>
			Array.from(
				new Set(
					reservations
						.map((reservation) => getMassageMeta(reservation.massage).name)
						.filter((name) => name !== "-"),
				),
			).sort((a, b) => a.localeCompare(b)),
		[reservations],
	);

	const filteredReservations = useMemo(
		() =>
			reservations
				.filter((reservation) => {
					const massageMeta = getMassageMeta(reservation.massage);
					const status = getStatus(
						reservation.reserveDate,
						reservation.isRated,
					).label;

					if (shopFilter && massageMeta.name !== shopFilter) {
						return false;
					}

					if (statusFilter !== "all") {
						if (statusFilter === "completed" && status !== "Completed") {
							return false;
						}
						if (statusFilter === "upcoming" && status !== "Upcoming") {
							return false;
						}
						if (statusFilter === "past" && status !== "Past") {
							return false;
						}
					}

					if (dateFilter && getDateKey(reservation.reserveDate) !== dateFilter) {
						return false;
					}

					return true;
				})
				.sort((first, second) => {
					const firstReserve = new Date(first.reserveDate).getTime();
					const secondReserve = new Date(second.reserveDate).getTime();

					if (sortBy === "date-asc") {
						return firstReserve - secondReserve;
					}

					if (sortBy === "created-asc") {
						const firstCreated = new Date(first.createdAt ?? 0).getTime();
						const secondCreated = new Date(second.createdAt ?? 0).getTime();
						return firstCreated - secondCreated;
					}

					if (sortBy === "created-desc") {
						const firstCreated = new Date(first.createdAt ?? 0).getTime();
						const secondCreated = new Date(second.createdAt ?? 0).getTime();
						return secondCreated - firstCreated;
					}

					return secondReserve - firstReserve;
				}),
		[dateFilter, reservations, shopFilter, sortBy, statusFilter],
	);

	const handleReset = () => {
		setShopFilter("");
		setStatusFilter("all");
		setDateFilter("");
		setSortBy("created-desc");
	};

	return (
		<div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">
			<div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="font-headline text-4xl leading-tight text-on-surface">
						All Reservations
					</h2>
					<p className="mt-2 max-w-lg text-on-surface-variant">
						Monitor and manage sanctuary appointments across all shop locations.
					</p>
				</div>
				<div className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
					{filteredReservations.length} of {totalCount} shown
				</div>
			</div>

			<ReservationsFilter
				shopFilter={shopFilter}
				setShopFilter={setShopFilter}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				dateFilter={dateFilter}
				setDateFilter={setDateFilter}
				sortBy={sortBy}
				setSortBy={setSortBy}
				shopOptions={shopOptions}
				onReset={handleReset}
			/>

			<div className="grid grid-cols-1 gap-6">
				{filteredReservations.map((reservation) => (
					<ReservationCard
						key={reservation._id}
						reservation={reservation}
						updateReservationAction={updateReservationAction}
						deleteReservationAction={deleteReservationAction}
					/>
				))}
			</div>

			{filteredReservations.length === 0 && (
				<div className="mt-6 rounded-xl bg-surface p-6 text-center text-sm text-on-surface-variant">
					No reservations found for the selected filters.
				</div>
			)}

			{hasNextPage && (
				<div className="mt-6 rounded-xl bg-surface p-4 text-sm text-on-surface-variant">
					More reservations are available on the next page.
				</div>
			)}
		</div>
	);
}
