import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";
import getReservation from "@/src/lib/reservation/getReservation";
import getUserProfile from "@/src/lib/auth/getUserProfile";
import HistoryReviewCard from "@/src/components/features/history/HistoryReviewCard";
import getShopById from "@/src/lib/shop/getShopById";
import { MassageShop } from "@/src/types/interface";
import getReviews from "@/src/lib/review/getReviews";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type HistoryReservationItem = {
    id: string;
    reviewId?: string;
    massageName: string;
    imageSrc: string;
    reserveDate?: string;
    completedOn: string;
    price?: number;
    netPrice?: number;
    discount?: { name: string; amount: number; percentage?: number }[];
    province?: string;
    tel?: string;
    createdAt?: string;
    rating?: number;
    comment?: string;
};
export default async function HistoryPage() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if (!token) {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center px-6 py-16">
                <div className="w-full rounded-3xl border border-[rgba(195,200,194,0.35)] bg-surface-container-lowest p-8 text-center shadow-[0_8px_30px_rgb(26_28_24/0.04)]">
                    <h1 className="font-headline text-3xl text-foreground">History</h1>
                    <p className="mt-3 text-sm text-on-surface-variant">
                        Sign in to view your booking history, rating, and review comments.
                    </p>
                </div>
            </div>
        );
    }

    const profile = await getUserProfile(token);
    const userId = profile?.data?._id;
    const reservations = await getReservation(token);

    let reviewsData: Awaited<ReturnType<typeof getReviews>>["data"] = [];
    try {
        const reviews = await getReviews(token);
        reviewsData = reviews.data;
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
    }

    // UPDATE 1: Add reviewId to the Map
    const reviewsByReservationId = new Map<
        string,
        { reviewId: string; rating: number; comment?: string; updatedAt?: string; createdAt?: string }
    >();

    for (const review of reviewsData) {
        const reservationId = typeof review.reservation === "object"
            ? review.reservation?._id
            : review.reservation;

        if (!reservationId) {
            continue;
        }

        const existing = reviewsByReservationId.get(reservationId);
        if (!existing) {
            reviewsByReservationId.set(reservationId, {
                reviewId: review._id, // <-- Store the Review ID
                rating: review.rating,
                comment: review.comment,
                updatedAt: review.updatedAt,
                createdAt: review.createdAt,
            });
            continue;
        }

        const existingTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
        const incomingTime = new Date(review.updatedAt || review.createdAt || 0).getTime();

        if (incomingTime >= existingTime) {
            reviewsByReservationId.set(reservationId, {
                reviewId: review._id, // <-- Store the Review ID
                rating: review.rating,
                comment: review.comment,
                updatedAt: review.updatedAt,
                createdAt: review.createdAt,
            });
        }
    }

    const pastReservations: HistoryReservationItem[] = await Promise.all(
        reservations.data
            .filter((appointment) => {
                const reserveDate = new Date(appointment.reserveDate);
                const now = new Date();

                if (typeof appointment.user === "object" && appointment.user?._id) {
                    return appointment.user._id === userId && reserveDate < now;
                }

                return false;
            })
            .sort(
                (first, second) =>
                    new Date(second.reserveDate).getTime() - new Date(first.reserveDate).getTime()
            )
            .map(async (appointment) => {
                const matchedReview = reviewsByReservationId.get(appointment._id);
                const massageId = typeof appointment.massage === "object"
                    ? appointment.massage._id
                    : appointment.massage;

                const massageName = typeof appointment.massage === "object"
                    ? appointment.massage.name
                    : "Unknown Massage";

                let imageSrc = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop";

                if (typeof appointment.massage === "object" && appointment.massage.pictures?.length) {
                    imageSrc = appointment.massage.pictures[0];
                } else if (massageId) {
                    const shopResponse = await getShopById<MassageShop>(massageId);
                    if (shopResponse?.data?.pictures?.length) {
                        imageSrc = shopResponse.data.pictures[0];
                    }
                    if (shopResponse?.data?.name) {
                        return {
                            id: appointment._id,
                            reviewId: matchedReview?.reviewId, // <-- Include the Review ID
                            massageName: shopResponse.data.name,
                            imageSrc,
                            reserveDate: appointment.reserveDate,
                            price: appointment.price,
                            netPrice: appointment.netPrice,
                            discount: appointment.discount,
                            province: shopResponse.data.province,
                            tel: shopResponse.data.tel,
                            createdAt: appointment.createdAt,
                            completedOn: new Date(appointment.reserveDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }),
                            rating: matchedReview?.rating ?? appointment.rating,
                            comment: matchedReview?.comment,
                        };
                    }
                }

                return {
                    id: appointment._id,
                    reviewId: matchedReview?.reviewId, // <-- Include the Review ID
                    massageName,
                    imageSrc,
                    reserveDate: appointment.reserveDate,
                    price: appointment.price,
                    netPrice: appointment.netPrice,
                    discount: appointment.discount,
                    province: typeof appointment.massage === "object" ? appointment.massage.province : undefined,
                    tel: typeof appointment.massage === "object" ? appointment.massage.tel : undefined,
                    createdAt: appointment.createdAt,
                    completedOn: new Date(appointment.reserveDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }),
                    rating: matchedReview?.rating ?? appointment.rating,
                    comment: matchedReview?.comment,
                };
            })
    );

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
            <header className="flex flex-col gap-4">
                <h1 className="font-headline text-[56px] leading-[1.05] text-primary">Booking History</h1>
                <p className="max-w-2xl text-base leading-7 text-on-surface-variant">
                    Review completed appointments, keep a note about each visit, and add your rating when you are ready.
                </p>
            </header>

            <section className="flex flex-col gap-6">
                {pastReservations.length === 0 ? (
                    <div className="rounded-3xl border border-[rgba(195,200,194,0.35)] bg-surface-container-lowest p-8 text-center shadow-[0_8px_30px_rgb(26_28_24/0.04)]">
                        <p className="text-on-surface-variant">No completed bookings found yet.</p>
                    </div>
                ) : (
                    pastReservations.map((reservation) => (
                        <HistoryReviewCard
                            key={reservation.id}
                            id={reservation.id} // Still passes Reservation ID (used to create a new review)
                            reviewId={reservation.reviewId} // UPDATE 2: Pass Review ID
                            massageName={reservation.massageName}
                            imageSrc={reservation.imageSrc}
                            reserveDate={reservation.reserveDate}
                            completedOn={reservation.completedOn}
                            price={reservation.price}
                            netPrice={reservation.netPrice}
                            discount={reservation.discount}
                            province={reservation.province}
                            tel={reservation.tel}
                            createdAt={reservation.createdAt}
                            token={token}
                            initialRating={reservation.rating}
                            initialComment={reservation.comment || ""}
                        />
                    ))
                )}
            </section>
        </div>
    );
}