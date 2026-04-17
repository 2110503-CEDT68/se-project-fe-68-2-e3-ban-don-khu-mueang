import { Footer } from "@/src/components/layout/footer";
import { Navbar } from "@/src/components/layout/navbar";

export default function BookingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}