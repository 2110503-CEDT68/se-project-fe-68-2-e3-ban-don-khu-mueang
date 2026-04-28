function getCurrentGreeting() {
    // Use Intl API to get the hour in Asia/Bangkok (UTC+7) reliably
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Bangkok",
        hour: "numeric",
        hour12: false,
    }).formatToParts(now);

    const hourPart = parts.find((p) => p.type === "hour");
    const bangkokHour = hourPart ? Number(hourPart.value) : (now.getUTCHours() + 7) % 24;

    if (bangkokHour < 12) return "Good Morning";
    if (bangkokHour < 18) return "Good Afternoon";
    return "Good Evening";
}

export default getCurrentGreeting;