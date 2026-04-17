import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import ThemeRegistry from "@/src/components/ThemeRegistry";
import ReduxProvider from "@/src/redux/ReduxProvider";
import NextAuthProvider from "@/src/providers/NextAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ZenMassage",
  description: "Wellness and massage booking experience",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${notoSerif.variable} antialiased`}>
        <NextAuthProvider session={session}>
          <ReduxProvider>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
