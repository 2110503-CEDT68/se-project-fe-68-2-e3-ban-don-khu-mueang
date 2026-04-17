"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
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
                  Welcome back to tranquility
                </h1>
                <p className="leading-relaxed text-on-surface-variant">
                  Please enter your details to access your sanctuary.
                </p>
              </div>
            </header>

            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group">
                  <label className="mb-2 ml-1 block text-sm text-on-surface-variant">Email address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-outline/15 bg-surface-container-low px-4 py-3 transition-all focus-within:border-outline/40">
                    <span className="material-symbols-outlined text-outline"><img src="/mail.svg" alt="Mail Icon" /></span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="w-full border-none bg-transparent text-on-surface placeholder:text-outline-variant focus:ring-0"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="mb-2 ml-1 block text-sm text-on-surface-variant">Password</label>
                  <div className="flex items-center gap-3 rounded-xl border border-outline/15 bg-surface-container-low px-4 py-3 transition-all focus-within:border-outline/40">
                    <span className="material-symbols-outlined text-outline"><img src="/lock.svg" alt="Lock Icon" /></span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full border-none bg-transparent text-on-surface placeholder:text-outline-variant focus:ring-0"
                    />
                  </div>
                </div>

                {error ? (
                  <p className="rounded-lg bg-error-container px-4 py-2 text-sm text-on-error-container">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary py-4 text-lg font-semibold text-on-primary transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative z-10">{isSubmitting ? "Signing In..." : "Sign In"}</span>
                  <span className="material-symbols-outlined relative z-10 text-xl transition-transform group-hover:translate-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right stroke-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10" />
                </button>
              </form>

              <p className="mt-8 text-center text-on-surface-variant">
                New to ZenMassage?{" "}
                <button
                  type="button"
                  className="font-bold text-primary underline-offset-4 hover:underline"
                  style={{ textDecorationColor: "var(--secondary-fixed-dim)", textDecorationThickness: "4px" }}
                >
                    <Link href="/register">
                  Create an account
                    </Link>
                </button>
              </p>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-surface" />}>
      <LoginPageContent />
    </Suspense>
  );
}
