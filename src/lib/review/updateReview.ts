export default async function updateReview(reservationId: string, rating: number, token: string, comment?: string) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${backendUrl}/api/reviews/${reservationId}`, {
        method: "PUT", // <-- Notice this is PUT, not POST
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update review");
    }

    return response.json();
}