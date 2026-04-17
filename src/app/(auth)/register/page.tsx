"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { apiBaseUrl } from "@/src/lib/config";

function RegisterPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/";

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [tel, setTel] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const formatPhoneNumber = (inputValue: string) => {
		const digitsOnly = inputValue.replace(/\D/g, "").slice(0, 10);

		if (digitsOnly.length <= 3) {
			return digitsOnly;
		}

		if (digitsOnly.length <= 6) {
			return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
		}

		return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		const telPattern = /^\d{3}-\d{3}-\d{4}$/;
		if (!telPattern.test(tel)) {
			setError("Phone number must be in format xxx-xxx-xxxx.");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					email,
					password,
					tel,
				}),
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as
					| { message?: string; error?: string }
					| null;
				setError(payload?.message ?? payload?.error ?? "Registration failed. Please try again.");
				setIsSubmitting(false);
				return;
			}

			const signInResult = await signIn("credentials", {
				email,
				password,
				redirect: false,
				callbackUrl,
			});

			setIsSubmitting(false);

			if (!signInResult || signInResult.error) {
				router.push("/login");
				return;
			}

			router.push(signInResult.url ?? callbackUrl);
			router.refresh();
		} catch {
			setError("Registration failed. Please try again.");
			setIsSubmitting(false);
		}
	};

	return (
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
							<span className="material-symbols-outlined text-3xl text-primary">
								<img src="/spa.svg" alt="Spa Icon" />
							</span>
							<span className="font-headline text-2xl tracking-tight text-primary">ZenMassage</span>
						</div>
						<div>
							<h1 className="mb-4 font-headline text-4xl leading-tight text-on-surface lg:text-5xl">
								Create your sanctuary account
							</h1>
							<p className="leading-relaxed text-on-surface-variant">
								Join ZenMassage and start booking your wellness sessions in minutes.
							</p>
						</div>
					</header>

					<div className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="mb-2 ml-1 block text-sm text-on-surface-variant">Full Name</label>
								<div className="flex items-center gap-3 rounded-xl border border-outline/15 bg-surface-container-low px-4 py-3 transition-all focus-within:border-outline/40">
									<span className="material-symbols-outlined text-outline">
                                        <img src="/user.svg" alt="Person Icon" />
                                    </span>
									<input
										type="text"
										required
										value={name}
										onChange={(event) => setName(event.target.value)}
										placeholder="Name Surname"
										className="w-full border-none bg-transparent text-on-surface placeholder:text-outline-variant focus:ring-0"
									/>
								</div>
							</div>

							<div>
								<label className="mb-2 ml-1 block text-sm text-on-surface-variant">Email address</label>
								<div className="flex items-center gap-3 rounded-xl border border-outline/15 bg-surface-container-low px-4 py-3 transition-all focus-within:border-outline/40">
									<span className="material-symbols-outlined text-outline">
										<img src="/mail.svg" alt="Mail Icon" />
									</span>
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

							<div>
								<label className="mb-2 ml-1 block text-sm text-on-surface-variant">Phone Number</label>
								<div className="flex items-center gap-3 rounded-xl border border-outline/15 bg-surface-container-low px-4 py-3 transition-all focus-within:border-outline/40">
									<span className="material-symbols-outlined text-outline">
                                        <img src="/phone.svg" alt="Phone Icon" />
                                    </span>
									<input
										type="tel"
										required
										pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
										inputMode="numeric"
										maxLength={12}
										value={tel}
										onChange={(event) => setTel(formatPhoneNumber(event.target.value))}
										placeholder="xxx-xxx-xxxx"
										className="w-full border-none bg-transparent text-on-surface placeholder:text-outline-variant focus:ring-0"
									/>
								</div>
							</div>

							<div>
								<label className="mb-2 ml-1 block text-sm text-on-surface-variant">Password</label>
								<div className="flex items-center gap-3 rounded-xl border border-outline/15 bg-surface-container-low px-4 py-3 transition-all focus-within:border-outline/40">
									<span className="material-symbols-outlined text-outline">
										<img src="/lock.svg" alt="Lock Icon" />
									</span>
									<input
										type="password"
										required
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										placeholder="Min. 8 characters"
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
								<span className="relative z-10">{isSubmitting ? "Creating account..." : "Create Account"}</span>
                  <span className="material-symbols-outlined relative z-10 text-xl transition-transform group-hover:translate-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right stroke-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
								<div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10" />
							</button>
						</form>

						<p className="mt-8 text-center text-on-surface-variant">
							Already have an account?{" "}
							<Link
								href="/login"
								className="font-bold text-primary underline-offset-4 hover:underline"
								style={{ textDecorationColor: "var(--secondary-fixed-dim)", textDecorationThickness: "4px" }}
							>
								Sign In
							</Link>
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
	);
}

export default function RegisterPage() {
	return (
		<Suspense fallback={<main className="min-h-screen bg-surface" />}>
			<RegisterPageContent />
		</Suspense>
	);
}
