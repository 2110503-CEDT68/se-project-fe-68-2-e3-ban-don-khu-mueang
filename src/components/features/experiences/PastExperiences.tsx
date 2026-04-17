import PastExperienceCard from "./PastExperienceCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";
import getReservation from "@/src/lib/reservation/getReservation";
import getUserProfile from "@/src/lib/auth/getUserProfile";

export default async function PastExperiences() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "mock_token";
    const profile  = await getUserProfile(token as string);
    const userId = profile?.data?._id;
    const reservations = await getReservation(token as string);

    const pastReservations = reservations.data.filter((app) => {
        const reserveDate = new Date(app.reserveDate);
        const now = new Date();
        if (typeof app.user === 'object' && app.user._id) {
            return app.user._id === userId && reserveDate < now;
        }
        return null;
    });

    return (
        <div className="flex flex-col gap-8 w-full">
            <h2 className="font-headline text-2xl text-foreground">Past Experiences</h2>

            <div className="flex flex-col gap-6 w-full">
                {pastReservations.length === 0 && (
                    <p className="text-secondary">No past experiences found.</p>
                )}

                {pastReservations.map((appointment) => {
                    const massageName = typeof appointment.massage === 'object' ? appointment.massage.name : "Unknown Massage";
                    const d = new Date(appointment.reserveDate);
                    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                        <PastExperienceCard
                            key={appointment._id}
                            id={appointment._id}
                            massageName={massageName}
                            date={formattedDate}
                            initialRating={appointment.rating || 0}
                            isRated={appointment.isRated || false}
                            token={token as string}
                        />
                    );
                })}
            </div>
        </div>
    );
}
