import Link from "next/link";
import UpcomeAppoint from "@/src/components/features/booking/UpcomeAppoint";

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

                <div className="flex flex-col gap-10 w-full max-w-[1232px]">
                    <section className="w-full">
                        <UpcomeAppoint />
                    </section>

                    <section className="flex w-full flex-col gap-5 rounded-3xl border border-[rgba(195,200,194,0.35)] bg-surface-container-lowest p-8 shadow-[0_8px_30px_rgb(26_28_24/0.04)] lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-2">
                            <h2 className="font-headline text-2xl text-foreground">Booking History</h2>
                            <p className="max-w-[560px] text-sm leading-6 text-on-surface-variant">
                                Open your history page to review completed appointments, leave a
                                rating, and add a comment for each visit.
                            </p>
                        </div>

                        <Link
                            href="/history"
                            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90"
                        >
                            View History
                        </Link>
                    </section>
                </div>
            </main>
        </div>
    );
}