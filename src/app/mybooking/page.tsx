import UpcomeAppoint from "@/src/components/features/booking/UpcomeAppoint";
import PastExperiences from "@/src/components/features/experiences/PastExperiences";

export default function MyBooking() {
    return (
        <div className="min-h-screen flex flex-col relative w-full items-center">
            <main className="w-full max-w-[1280px] px-6 py-12 flex flex-col gap-16 relative">
                {/* Header */}
                <header className="flex flex-col gap-4 w-full max-w-[1232px]">
                    <h1 className="font-headline text-[60px] leading-[60px] text-primary">
                        Your Sanctuary
                    </h1>
                    <h1 className="font-headline text-[60px] leading-[60px] text-[#715A48] italic">
                        Schedule
                    </h1>
                    <p className="font-sans text-[18px] leading-[28px] text-on-surface-variant max-w-[576px]">
                        Manage your upcoming moments of tranquility and reflect on your
                        past journeys toward wellness.
                    </p>
                </header>

                {/* Main Content Area: Asymmetric Layout */}
                <div className="flex flex-col lg:flex-row gap-[106px] w-full max-w-[1232px]">
                    <section className="flex-1 w-full lg:max-w-[805px]">
                        <UpcomeAppoint />
                    </section>

                    <aside className="w-full lg:max-w-[378px]">
                        <PastExperiences />
                    </aside>
                </div>
            </main>
        </div>
    );
}