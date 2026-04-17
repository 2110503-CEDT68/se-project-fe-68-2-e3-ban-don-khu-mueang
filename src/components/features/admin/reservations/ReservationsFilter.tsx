"use client";

type ReservationsFilterProps = {
	shopFilter: string;
	setShopFilter: (value: string) => void;
	statusFilter: string;
	setStatusFilter: (value: string) => void;
	dateFilter: string;
	setDateFilter: (value: string) => void;
	sortBy: string;
	setSortBy: (value: string) => void;
	shopOptions: string[];
	onReset: () => void;
};

export default function ReservationsFilter({
	shopFilter,
	setShopFilter,
	statusFilter,
	setStatusFilter,
	dateFilter,
	setDateFilter,
	sortBy,
	setSortBy,
	shopOptions,
	onReset,
}: ReservationsFilterProps) {
	return (
		<div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-surface-container-low p-4 md:grid-cols-4">
			<select
				value={shopFilter}
				onChange={(event) => setShopFilter(event.target.value)}
				className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
			>
				<option value="">All shops</option>
				{shopOptions.map((shopName) => (
					<option key={shopName} value={shopName}>
						{shopName}
					</option>
				))}
			</select>

			<select
				value={statusFilter}
				onChange={(event) => setStatusFilter(event.target.value)}
				className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
			>
				<option value="all">All status</option>
				<option value="upcoming">Upcoming</option>
				<option value="past">Past</option>
				<option value="completed">Completed</option>
			</select>

			<input
				type="date"
				value={dateFilter}
				onChange={(event) => setDateFilter(event.target.value)}
				className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
			/>

			<select
				value={sortBy}
				onChange={(event) => setSortBy(event.target.value)}
				className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
			>
				<option value="date-desc">Date (newest)</option>
				<option value="date-asc">Date (oldest)</option>
				<option value="created-desc">Created (newest)</option>
				<option value="created-asc">Created (oldest)</option>
			</select>

			<div className="md:col-span-4 flex items-center justify-end gap-2">
				<button
					type="button"
					onClick={onReset}
					className="rounded-full border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant"
				>
					Reset
				</button>
			</div>
		</div>
	);
}
