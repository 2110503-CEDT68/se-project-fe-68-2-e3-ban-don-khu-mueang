"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLogout = async () => {
    setIsSubmitting(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <main className="grid min-h-screen overflow-hidden lg:grid-cols-12">
        <section className="relative z-10 flex flex-col justify-center bg-surface px-8 py-12 lg:col-span-5 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <header className="mb-12">
              <Link
                href="/"
                className="mb-6 inline-flex items-center text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
              >
                ← Back to Home
              </Link>
              <div className="mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary"><img src="/spa.svg" alt="Spa Icon" /></span>
                <span className="font-headline text-2xl tracking-tight text-primary">ZenMassage</span>
              </div>
              <div>
                <h1 className="mb-4 font-headline text-4xl leading-tight text-on-surface lg:text-5xl">
                  Log Out of Your Zen Journey
                </h1>
                <p className="leading-relaxed text-on-surface-variant">
                  Are you sure you want to log out?
                </p>
              </div>
            </header>

            <div className="space-y-6">
                <button
                onClick={handleLogout}
                //   type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary py-4 text-lg font-semibold text-on-primary transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative z-10">{isSubmitting ? "Logging Out..." : "Log Out"}</span>
                  <span className="material-symbols-outlined relative z-10 text-xl transition-transform group-hover:translate-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right stroke-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10" />
                </button>
            </div>
          </div>
        </section>

        <section className="relative hidden bg-surface-container lg:col-span-7 lg:block">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://fe-storage.rachatat.com/auth-image-4.png"
              alt="Luxury Spa Interior"
              fill
              sizes="58vw"
              className="h-full w-full object-cover brightness-[0.85] grayscale-20"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-linear-to-t from-primary/60 via-transparent to-transparent" />
        </section>
      </main>
    </>
  );
}
