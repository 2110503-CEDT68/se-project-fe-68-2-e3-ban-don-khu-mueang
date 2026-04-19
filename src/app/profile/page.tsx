import { redirect } from "next/navigation";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";
import UserInfo from "@/src/components/features/userProfile/userInfo"; 
import ProfileCalendarWidget from "@/src/components/features/userProfile/BookingLogCalendar"; 

// IMPORT your existing function! (Adjust the path if it's saved somewhere else)
import getReservation from "@/src/lib/reservation/getReservation"; 

export default async function UserProfilePage() {
  const { session, profile } = await getSessionAuthContext();

  if (!session || !profile) {
    redirect("/login");
  }

  // 1. Fetch using your existing getReservation function!
  let reservations = [];
  try {
    const response = await getReservation(session.user.token);
    reservations = response.data || [];
  } catch (error) {
    console.error("Failed to fetch reservations", error);
  }

  // 2. Calculate Stats
  const now = new Date();
  let alreadyEndedCount = 0;
  let inProgressCount = 0;

  // 3. Format data for the Calendar Heatmap
  const bookingLogs: Record<string, any[]> = {};

  reservations.forEach((res) => {
    // FIX: Match your interface's 'reserveDate' property
    const apptDate = new Date(res.reserveDate); 
    
    // Check if appointment is in the past
    if (apptDate < now) {
      alreadyEndedCount++;
    } else {
      inProgressCount++;
    }

    // Format for the heatmap keys (YYYY-MM-DD)
    const dateStr = apptDate.toISOString().split("T")[0];
    const timeStr = apptDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    
    if (!bookingLogs[dateStr]) {
      bookingLogs[dateStr] = [];
    }

    // FIX: Match your interface's 'massage' property. 
    // We also check if it's an object in case it wasn't populated properly by the backend.
    const shopName = typeof res.massage === 'object' && res.massage !== null 
        ? res.massage.name 
        : "Unknown Shop";

    // Add to the log
    bookingLogs[dateStr].push({
      id: res._id,
      shop: shopName,
      time: timeStr,
      status: apptDate < now ? "Completed" : "On Going",
    });
  });

  return (
    <main className="min-h-screen bg-surface-container-lowest p-6 pt-12 lg:p-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:p-12 border border-surface-container-highest">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16">
          
          <section className="flex flex-col border-surface-container-high md:border-r md:pr-12">
            <ProfileCalendarWidget bookingLogs={bookingLogs} />
          </section>

          <section className="flex flex-col justify-start pt-6">
            <UserInfo 
              user={{
                name: profile.data.name,
                email: profile.data.email,
              }} 
              stats={{
                total: reservations.length,
                ended: alreadyEndedCount,
                inProgress: inProgressCount
              }}
            />
          </section>

        </div>
      </div>
    </main>
  );
}