import { revalidatePath } from "next/cache";
import { AdminApiClient } from "@/src/lib/admin/adminApiClient";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import ReservationsListClient from "@/src/components/features/admin/reservations/reservationsListClient";

export default async function ManageReservationsPage() {
	const { session } = await requireAdminAuth();
	const token = session?.user?.token as string;

	const api = new AdminApiClient(token);

	const reservationsResponse = await api.getReservations().catch(() => ({
		success: false,
		count: 0,
		totalCount: 0,
		pagination: undefined,
		data: [],
	}));

	const hasNextPage = Boolean(reservationsResponse.pagination?.next);

	async function updateReservationAction(formData: FormData) {
		"use server";

		const { session: actionSession } = await requireAdminAuth();
		const actionToken = actionSession?.user?.token as string;

		const actionApi = new AdminApiClient(actionToken);

		const reservationId = String(formData.get("reservationId") ?? "").trim();
		const reserveDate = String(formData.get("reserveDate") ?? "").trim();

		if (!reservationId || !reserveDate) {
			return;
		}

		await actionApi.updateReservationDate(
			reservationId,
			new Date(reserveDate).toISOString()
		);

		revalidatePath("/admin/reservations");
	}

	async function deleteReservationAction(formData: FormData) {
		"use server";

		const { session: actionSession } = await requireAdminAuth();
		const actionToken = actionSession?.user?.token as string;

		const actionApi = new AdminApiClient(actionToken);

		const reservationId = String(formData.get("reservationId") ?? "").trim();

		if (!reservationId) {
			return;
		}

		await actionApi.deleteReservation(reservationId);

		revalidatePath("/admin/reservations");
	}

	return (
		<ReservationsListClient
			reservations={reservationsResponse.data}
			totalCount={reservationsResponse.count}
			hasNextPage={hasNextPage}
			updateReservationAction={updateReservationAction}
			deleteReservationAction={deleteReservationAction}
		/>
	);
}