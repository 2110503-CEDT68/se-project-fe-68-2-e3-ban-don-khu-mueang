const BANGKOK_OFFSET_HOURS = 7;
const BANGKOK_OFFSET_SUFFIX = "+07:00";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function toBangkokOffsetDateTime(input: string | Date): string {
  if (typeof input === "string") {
    // Preserve datetime-local selection and attach explicit Bangkok offset.
    const localDateTimeMatch = input.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
    );

    if (localDateTimeMatch) {
      const [, year, month, day, hour, minute, second] = localDateTimeMatch;
      return `${year}-${month}-${day}T${hour}:${minute}:${second ?? "00"}${BANGKOK_OFFSET_SUFFIX}`;
    }
  }

  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const bangkokDate = new Date(date.getTime() + BANGKOK_OFFSET_HOURS * 60 * 60 * 1000);
  const year = bangkokDate.getUTCFullYear();
  const month = pad2(bangkokDate.getUTCMonth() + 1);
  const day = pad2(bangkokDate.getUTCDate());
  const hour = pad2(bangkokDate.getUTCHours());
  const minute = pad2(bangkokDate.getUTCMinutes());
  const second = pad2(bangkokDate.getUTCSeconds());

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${BANGKOK_OFFSET_SUFFIX}`;
}