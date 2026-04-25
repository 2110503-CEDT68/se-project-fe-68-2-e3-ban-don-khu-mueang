export function toDatetimeLocal(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const pad = (number: number) => String(number).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
		date.getDate(),
	)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getUserMeta(
    value:
        | string
        | {
            _id?: string;
            id?: string;
            name?: string;
            email?: string;
            tel?: string;
            avatarUrl?: string | null;
        },
) {
	if (typeof value === "string") {
		return {
			name: value,
			email: "-",
			tel: "-",
			avatarUrl: null,
			avatarSeed: value,
		};
	}

	return {
		name: value.name ?? value.email ?? "-",
		email: value.email ?? "-",
		tel: value.tel ?? "-",
		avatarUrl: value.avatarUrl ?? null,
		avatarSeed: value._id ?? value.id ?? value.email ?? value.name ?? "user",
	};
}

export function getMassageMeta(value: string | { name?: string; province?: string; tel?: string }) {
	if (typeof value === "string") {
		return { name: value, province: "-", tel: "-" };
	}

	return {
		name: value.name ?? "-",
		province: value.province ?? "-",
		tel: value.tel ?? "-",
	};
}

export function getStatus(reserveDate: string, isRated?: boolean) {
	if (isRated) {
		return {
			label: "Completed",
			className:
				"inline-flex items-center rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold text-on-tertiary-fixed",
		};
	}

	const date = new Date(reserveDate);
	if (!Number.isNaN(date.getTime()) && date.getTime() < Date.now()) {
		return {
			label: "Past",
			className:
				"inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container",
		};
	}

	return {
		label: "Upcoming",
		className:
			"inline-flex items-center rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed",
	};
}

export function getDateKey(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return date.toISOString().slice(0, 10);
}
