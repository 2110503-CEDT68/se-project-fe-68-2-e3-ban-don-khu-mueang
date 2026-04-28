import BookCard from "./BookCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";
import getReservation, { ReservationMassage } from "@/src/lib/reservation/getReservation";
import getShopById from "@/src/lib/shop/getShopById";
import { MassageShop } from "@/src/types/interface";
import getUserProfile from "@/src/lib/auth/getUserProfile";

export default async function UpcomeAppoint() {

    const session = await getServerSession(authOptions);
    const token = session?.user?.token || "mock_token";
    const profile  = await getUserProfile(token as string);
    const userId = profile?.data?._id;
    const reservations = await getReservation(token as string);


    // const upcomingReservations = reservations.data.filter((app) => {
    //     const reserveDate = new Date(app.reserveDate);
    //     const now = new Date();
    //     if (typeof app.user === 'object' && app.user._id) {
    //         return app.user._id === userId && reserveDate >= now;
    //     }
    //     return null;
    // });

    const upcomingReservations = reservations.data.filter((app) => {
        // This creates a string like "4/28/2026, 9:30:00 PM" specifically for Bangkok
        const bangkokString = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
        
        // We then turn that string back into a Date object we can compare
        const nowBangkok = new Date(bangkokString);
        const reserveDate = new Date(app.reserveDate);

        if (typeof app.user === 'object' && app.user._id) {
            return app.user._id === userId && reserveDate >= nowBangkok;
        }
        return null;
    });

    const reservationsWithPictures = await Promise.all(upcomingReservations.map(async (appointment) => {
        let pictures: string[] = [];
        let massageName = "Unknown Massage";
        
        if (typeof appointment.massage === 'object') {
            massageName = appointment.massage.name || massageName;
            const shopId = (appointment.massage as ReservationMassage)._id || (appointment.massage as ReservationMassage & { id?: string }).id;
            
            if (appointment.massage.pictures && appointment.massage.pictures.length > 0) {
                pictures = appointment.massage.pictures;
            } else if (shopId) {
                const shopRes = await getShopById<MassageShop>(shopId);
                if (shopRes?.data?.pictures) {
                    pictures = shopRes.data.pictures;
                }
            }
        } else if (typeof appointment.massage === 'string') {
            const shopRes = await getShopById<MassageShop>(appointment.massage);
            if (shopRes?.data) {
                massageName = shopRes.data.name || massageName;
                if (shopRes.data.pictures) {
                    pictures = shopRes.data.pictures;
                }
            }
        }

        return {
            ...appointment,
            computedMassageName: massageName,
            computedPictures: pictures
        };
    }));

    return (
        <div className="flex flex-col gap-12 w-full">
            <div className="flex items-center gap-6">
                <h2 className="font-headline text-[30px] leading-9 text-foreground">
                    Upcoming Appointments
                </h2>
                <div className="flex px-4 py-1 bg-secondary-container rounded-full items-center justify-center">
                    <span className="font-bold text-xs uppercase tracking-[1.2px] text-on-secondary-container">
                        {upcomingReservations.length}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
                {reservationsWithPictures.map((appointment) => {
                    const imageSrc = appointment.computedPictures.length > 0
                        ? appointment.computedPictures[0]
                        : "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop";

                    const d = new Date(appointment.reserveDate);
                    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                    return (
                        <BookCard
                            key={appointment._id}
                            id={appointment._id}
                            token={token as string}
                            reserveDate={appointment.reserveDate}
                            title={appointment.computedMassageName}
                            imageSrc={imageSrc}
                            date={formattedDate}
                            time={time}
                            province={typeof appointment.massage === 'object' ? appointment.massage.province : undefined}
                            tel={typeof appointment.massage === 'object' ? appointment.massage.tel : undefined}
                            price={appointment.price}
                            netPrice={appointment.netPrice}
                            discount={appointment.discount}
                            createdAt={appointment.createdAt}
                        />
                    );
                })}
                {reservationsWithPictures.length === 0 && (
                    <p className="text-secondary">No upcoming appointments found.</p>
                )}
            </div>
        </div>
    );
}