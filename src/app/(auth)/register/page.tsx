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
	const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
	const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

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

							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="privacy-policy"
									checked={isPolicyAccepted}
									onChange={(e) => setIsPolicyAccepted(e.target.checked)}
									className="h-4 w-4 rounded border-outline text-primary focus:ring-primary"
								/>
								<label htmlFor="privacy-policy" className="text-sm text-on-surface-variant">
									I agree to the{" "}
									<button
										type="button"
										onClick={() => setIsPolicyModalOpen(true)}
										className="font-bold text-primary hover:underline"
									>
										Privacy Policy
									</button>
								</label>
							</div>

							{error ? (
								<p className="rounded-lg bg-error-container px-4 py-2 text-sm text-on-error-container">{error}</p>
							) : null}

							<button
								type="submit"
								disabled={isSubmitting || !isPolicyAccepted}
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

			{isPolicyModalOpen && (
				<div 
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
					onClick={() => setIsPolicyModalOpen(false)}
				>
					<div 
						className="relative flex w-full max-w-lg flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl"
						onClick={(e) => e.stopPropagation()}
					>
						<header className="mb-4 flex items-center justify-between">
							<h2 className="font-headline text-2xl text-on-surface">Privacy Policy</h2>
							<button
								type="button"
								onClick={() => setIsPolicyModalOpen(false)}
								className="text-on-surface-variant hover:text-on-surface transition-colors"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
							</button>
						</header>
						
						<div className="flex-1 overflow-y-auto pr-2 text-sm text-on-surface-variant space-y-4">
							<h1 className="font-semibold text-on-surface text-lg">นโยบายความเป็นส่วนตัวสำหรับลูกค้า</h1>
							<p>ZenMassage ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ โดยนโยบายความเป็นส่วนตัวฉบับนี้ได้อธิบายแนวปฏิบัติเกี่ยวกับการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล รวมถึงสิทธิต่าง ๆ ของเจ้าของข้อมูลส่วนบุคคล ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">การเก็บรวบรวมข้อมูลส่วนบุคคล</h2>
							<p>เราจะเก็บรวบรวมข้อมูลส่วนบุคคลที่ได้รับโดยตรงจากคุณผ่านช่องทาง ดังต่อไปนี้</p>
							<ul className="list-disc pl-5">
								<li>การสมัครสมาชิก</li>
								<li>โทรศัพท์</li>
								<li>อีเมล</li>
							</ul>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">ประเภทข้อมูลส่วนบุคคลที่เก็บรวบรวม</h2>
							<p><b>ข้อมูลส่วนบุคคล</b> เช่น ชื่อ นามสกุล อายุ วันเดือนปีเกิด สัญชาติ เลขประจำตัวประชาชน หนังสือเดินทาง เป็นต้น</p>
							<p><b>ข้อมูลการติดต่อ</b> เช่น ที่อยู่ หมายเลขโทรศัพท์ อีเมล เป็นต้น</p>
							<p><b>ข้อมูลบัญชี</b> เช่น บัญชีผู้ใช้งาน ประวัติการใช้งาน เป็นต้น</p>
							<p><b>ข้อมูลการทำธุรกรรมและการเงิน</b> เช่น ประวัติการสั่งซื้อ รายละเอียดบัตรเครดิต บัญชีธนาคาร เป็นต้น</p>
							<p><b>ข้อมูลทางเทคนิค</b> เช่น IP address, Cookie ID, ประวัติการใช้งานเว็บไซต์ (Activity Log) เป็นต้น</p>
							<p><b>ข้อมูลอื่น ๆ</b> เช่น รูปภาพ ภาพเคลื่อนไหว และข้อมูลอื่นใดที่ถือว่าเป็นข้อมูลส่วนบุคคลตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">ผู้เยาว์</h2>
							<p>หากคุณมีอายุต่ำกว่า 20 ปีหรือมีข้อจำกัดความสามารถตามกฎหมาย เราอาจเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ เราอาจจำเป็นต้องให้พ่อแม่หรือผู้ปกครองของคุณให้ความยินยอมหรือที่กฎหมายอนุญาตให้ทำได้ หากเราทราบว่ามีการเก็บรวบรวมข้อมูลส่วนบุคคลจากผู้เยาว์โดยไม่ได้รับความยินยอมจากพ่อแม่หรือผู้ปกครอง เราจะดำเนินการลบข้อมูลนั้นออกจากเซิร์ฟเวอร์ของเรา</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">วิธีการเก็บรักษาข้อมูลส่วนบุคคล</h2>
							<p>เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณในรูปแบบเอกสารและรูปแบบอิเล็กทรอนิกส์</p>
							<p>เราเก็บรักษาข้อมูลส่วนบุคคลของคุณ ดังต่อไปนี้</p>
							<ul className="list-disc pl-5">
								<li>ผู้ให้บริการเซิร์ฟเวอร์ในต่างประเทศ</li>
							</ul>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">การประมวลผลข้อมูลส่วนบุคคล</h2>
							<p>เราจะเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณเพื่อวัตถุประสงค์ดังต่อไปนี้</p>
							<ul className="list-disc pl-5">
								<li>เพื่อสร้างและจัดการบัญชีผู้ใช้งาน</li>
								<li>เพื่อจัดส่งสินค้าหรือบริการ</li>
								<li>เพื่อการตลาดและการส่งเสริมการขาย</li>
								<li>เพื่อชำระค่าสินค้าหรือบริการ</li>
								<li>เพื่อปฏิบัติตามข้อตกลงและเงื่อนไข (Terms and Conditions)</li>
							</ul>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">การเปิดเผยข้อมูลส่วนบุคคล</h2>
							<p>เราอาจเปิดเผยข้อมูลส่วนบุคคลของคุณให้แก่ผู้อื่นภายใต้ความยินยอมของคุณหรือที่กฎหมายอนุญาตให้เปิดเผยได้ ดังต่อไปนี้</p>
							<p><b>การบริหารจัดการภายในองค์กร</b></p>
							<p>เราอาจเปิดเผยข้อมูลส่วนบุคคลของคุณภายในบริษัทเท่าที่จำเป็นเพื่อปรับปรุงและพัฒนาสินค้าหรือบริการของเรา เราอาจรวบรวมข้อมูลภายในสำหรับสินค้าหรือบริการต่าง ๆ ภายใต้นโยบายนี้เพื่อประโยชน์ของคุณและผู้อื่นมากขึ้น</p>
							<p><b>ผู้ให้บริการ</b></p>
							<p>เราอาจเปิดเผยข้อมูลส่วนบุคคลของคุณบางอย่างให้กับผู้ให้บริการของเราเท่าที่จำเป็นเพื่อดำเนินงานในด้านต่าง ๆ เช่น การชำระเงิน การตลาด การพัฒนาสินค้าหรือบริการ เป็นต้น ทั้งนี้ ผู้ให้บริการมีนโยบายความเป็นส่วนตัวของตนเอง</p>
							<p><b>การโอนข้อมูลส่วนบุคคลไปต่างประเทศ</b></p>
							<p>เราอาจเปิดเผยหรือโอนข้อมูลส่วนบุคคลของคุณไปยังบุคคล องค์กร หรือเซิร์ฟเวอร์ (Server) ที่ตั้งอยู่ในต่างประเทศ โดยเราจะดำเนินการตามมาตรการต่าง ๆ เพื่อให้มั่นใจว่าการโอนข้อมูลส่วนบุคคลของคุณไปยังประเทศปลายทางนั้นมีมาตรฐานการคุ้มครองข้อมูลส่วนบุคคลอย่างเพียงพอ หรือกรณีอื่น ๆ ตามที่กฎหมายกำหนด</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">ระยะเวลาจัดเก็บข้อมูลส่วนบุคคล</h2>
							<p>เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณไว้ตามระยะเวลาที่จำเป็นในระหว่างที่คุณเป็นลูกค้าหรือมีความสัมพันธ์อยู่กับเราหรือตลอดระยะเวลาที่จำเป็นเพื่อให้บรรลุวัตถุประสงค์ที่เกี่ยวข้องกับนโยบายฉบับนี้ ซึ่งอาจจำเป็นต้องเก็บรักษาไว้ต่อไปภายหลังจากนั้น หากมีกฎหมายกำหนดไว้ เราจะลบ ทำลาย หรือทำให้เป็นข้อมูลที่ไม่สามารถระบุตัวตนของคุณได้ เมื่อหมดความจำเป็นหรือสิ้นสุดระยะเวลาดังกล่าว</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
							<p>ภายใต้กฎหมายคุ้มครองข้อมูลส่วนบุคคล คุณมีสิทธิในการดำเนินการดังต่อไปนี้</p>
							<p><b>สิทธิขอถอนความยินยอม (right to withdraw consent)</b> หากคุณได้ให้ความยินยอม เราจะเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ ไม่ว่าจะเป็นความยินยอมที่คุณให้ไว้ก่อนวันที่กฎหมายคุ้มครองข้อมูลส่วนบุคคลใช้บังคับหรือหลังจากนั้น คุณมีสิทธิที่จะถอนความยินยอมเมื่อใดก็ได้ตลอดเวลา</p>
							<p><b>สิทธิขอเข้าถึงข้อมูล (right to access)</b> คุณมีสิทธิขอเข้าถึงข้อมูลส่วนบุคคลของคุณที่อยู่ในความรับผิดชอบของเราและขอให้เราทำสำเนาข้อมูลดังกล่าวให้แก่คุณ รวมถึงขอให้เราเปิดเผยว่าเราได้ข้อมูลส่วนบุคคลของคุณมาได้อย่างไร</p>
							<p><b>สิทธิขอถ่ายโอนข้อมูล (right to data portability)</b> คุณมีสิทธิขอรับข้อมูลส่วนบุคคลของคุณในกรณีที่เราได้จัดทำข้อมูลส่วนบุคคลนั้นอยู่ในรูปแบบให้สามารถอ่านหรือใช้งานได้ด้วยเครื่องมือหรืออุปกรณ์ที่ทำงานได้โดยอัตโนมัติและสามารถใช้หรือเปิดเผยข้อมูลส่วนบุคคลได้ด้วยวิธีการอัตโนมัติ รวมทั้งมีสิทธิขอให้เราส่งหรือโอนข้อมูลส่วนบุคคลในรูปแบบดังกล่าวไปยังผู้ควบคุมข้อมูลส่วนบุคคลอื่นเมื่อสามารถทำได้ด้วยวิธีการอัตโนมัติ และมีสิทธิขอรับข้อมูลส่วนบุคคลที่เราส่งหรือโอนข้อมูลส่วนบุคคลในรูปแบบดังกล่าวไปยังผู้ควบคุมข้อมูลส่วนบุคคลอื่นโดยตรง เว้นแต่ไม่สามารถดำเนินการได้เพราะเหตุทางเทคนิค</p>
							<p><b>สิทธิขอคัดค้าน (right to object)</b> คุณมีสิทธิขอคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณในเวลาใดก็ได้ หากการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณที่ทำขึ้นเพื่อการดำเนินงานที่จำเป็นภายใต้ประโยชน์โดยชอบด้วยกฎหมายของเราหรือของบุคคลหรือนิติบุคคลอื่น โดยไม่เกินขอบเขตที่คุณสามารถคาดหมายได้อย่างสมเหตุสมผลหรือเพื่อดำเนินการตามภารกิจเพื่อสาธารณประโยชน์</p>
							<p><b>สิทธิขอให้ลบหรือทำลายข้อมูล (right to erasure/destruction)</b> คุณมีสิทธิขอลบหรือทำลายข้อมูลส่วนบุคคลของคุณหรือทำให้ข้อมูลส่วนบุคคลเป็นข้อมูลที่ไม่สามารถระบุตัวคุณได้ หากคุณเชื่อว่าข้อมูลส่วนบุคคลของคุณถูกเก็บรวบรวม ใช้ หรือเปิดเผยโดยไม่ชอบด้วยกฎหมายที่เกี่ยวข้องหรือเห็นว่าเราหมดความจำเป็นในการเก็บรักษาไว้ตามวัตถุประสงค์ที่เกี่ยวข้องในนโยบายฉบับนี้ หรือเมื่อคุณได้ใช้สิทธิขอถอนความยินยอมหรือใช้สิทธิขอคัดค้านตามที่แจ้งไว้ข้างต้นแล้ว</p>
							<p><b>สิทธิขอให้ระงับการใช้ข้อมูล (right to restriction of processing)</b> คุณมีสิทธิขอให้ระงับการใช้ข้อมูลส่วนบุคคลชั่วคราวในกรณีที่เราอยู่ระหว่างตรวจสอบตามคำร้องขอใช้สิทธิขอแก้ไขข้อมูลส่วนบุคคลหรือขอคัดค้านของคุณหรือกรณีอื่นใดที่เราหมดความจำเป็นและต้องลบหรือทำลายข้อมูลส่วนบุคคลของคุณตามกฎหมายที่เกี่ยวข้องแต่คุณขอให้เราระงับการใช้แทน</p>
							<p><b>สิทธิขอให้แก้ไขข้อมูล (right to rectification)</b> คุณมีสิทธิขอแก้ไขข้อมูลส่วนบุคคลของคุณให้ถูกต้อง เป็นปัจจุบัน สมบูรณ์ และไม่ก่อให้เกิดความเข้าใจผิด</p>
							<p><b>สิทธิร้องเรียน (right to lodge a complaint)</b> คุณมีสิทธิร้องเรียนต่อผู้มีอำนาจตามกฎหมายที่เกี่ยวข้อง หากคุณเชื่อว่าการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ เป็นการกระทำในลักษณะที่ฝ่าฝืนหรือไม่ปฏิบัติตามกฎหมายที่เกี่ยวข้อง</p>
							<p>คุณสามารถใช้สิทธิของคุณในฐานะเจ้าของข้อมูลส่วนบุคคลข้างต้นได้ โดยติดต่อมาที่เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเราตามรายละเอียดท้ายนโยบายนี้ เราจะแจ้งผลการดำเนินการภายในระยะเวลา 30 วัน นับแต่วันที่เราได้รับคำขอใช้สิทธิจากคุณ ตามแบบฟอร์มหรือวิธีการที่เรากำหนด ทั้งนี้ หากเราปฏิเสธคำขอเราจะแจ้งเหตุผลของการปฏิเสธให้คุณทราบผ่านช่องทางต่าง ๆ เช่น ข้อความ (SMS) อีเมล โทรศัพท์ จดหมาย เป็นต้น</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">เทคโนโลยีติดตามตัวบุคคล (Cookies)</h2>
							<p>เพื่อเพิ่มประสบการณ์การใช้งานของคุณให้สมบูรณ์และมีประสิทธิภาพมากขึ้น เราใช้คุกกี้ (Cookies)หรือเทคโนโลยีที่คล้ายคลึงกัน เพื่อพัฒนาการเข้าถึงสินค้าหรือบริการ โฆษณาที่เหมาะสม และติดตามการใช้งานของคุณ เราใช้คุกกี้เพื่อระบุและติดตามผู้ใช้งานเว็บไซต์และการเข้าถึงเว็บไซต์ของเรา หากคุณไม่ต้องการให้มีคุกกี้ไว้ในคอมพิวเตอร์ของคุณ คุณสามารถตั้งค่าบราวเซอร์เพื่อปฏิเสธคุกกี้ก่อนที่จะใช้เว็บไซต์ของเราได้</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">การรักษาความมั่งคงปลอดภัยของข้อมูลส่วนบุคคล</h2>
							<p>เราจะรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคลของคุณไว้ตามหลักการ การรักษาความลับ (confidentiality) ความถูกต้องครบถ้วน (integrity) และสภาพพร้อมใช้งาน (availability) ทั้งนี้ เพื่อป้องกันการสูญหาย เข้าถึง ใช้ เปลี่ยนแปลง แก้ไข หรือเปิดเผย นอกจากนี้เราจะจัดให้มีมาตรการรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคล ซึ่งครอบคลุมถึงมาตรการป้องกันด้านการบริหารจัดการ (administrative safeguard) มาตรการป้องกันด้านเทคนิค (technical safeguard) และมาตรการป้องกันทางกายภาพ (physical safeguard) ในเรื่องการเข้าถึงหรือควบคุมการใช้งานข้อมูลส่วนบุคคล (access control)</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">การแจ้งเหตุละเมิดข้อมูลส่วนบุคคล</h2>
							<p>ในกรณีที่มีเหตุละเมิดข้อมูลส่วนบุคคลของคุณเกิดขึ้น เราจะแจ้งให้สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลทราบโดยไม่ชักช้าภายใน 72 ชั่วโมง นับแต่ทราบเหตุเท่าที่สามารถกระทำได้ ในกรณีที่การละเมิดมีความเสี่ยงสูงที่จะมีผลกระทบต่อสิทธิและเสรีภาพของคุณ เราจะแจ้งการละเมิดให้คุณทราบพร้อมกับแนวทางการเยียวยาโดยไม่ชักช้าผ่านช่องทางต่าง ๆ เช่น เว็บไซต์ ข้อความ (SMS) อีเมล โทรศัพท์ จดหมาย เป็นต้น</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">การแก้ไขเปลี่ยนแปลงนโยบายความเป็นส่วนตัว</h2>
							<p>เราอาจแก้ไขเปลี่ยนแปลงนโยบายนี้เป็นครั้งคราว โดยคุณสามารถทราบข้อกำหนดและเงื่อนไขนโยบายที่มีการแก้ไขเปลี่ยนแปลงนี้ได้ผ่านทางเว็บไซต์ของเรา</p>
							<p>นโยบายนี้แก้ไขล่าสุดและมีผลใช้บังคับตั้งแต่วันที่ 25 เมษายน 2569</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">นโยบายความเป็นส่วนตัวของเว็บไซต์อื่น</h2>
							<p>นโยบายความเป็นส่วนตัวฉบับนี้ใช้สำหรับการเสนอสินค้า บริการ และการใช้งานบนเว็บไซต์สำหรับลูกค้าของเราเท่านั้น หากคุณเข้าชมเว็บไซต์อื่นแม้จะผ่านช่องทางเว็บไซต์ของเรา การคุ้มครองข้อมูลส่วนบุคคลต่าง ๆ จะเป็นไปตามนโยบายความเป็นส่วนตัวของเว็บไซต์นั้น ซึ่งเราไม่มีส่วนเกี่ยวข้องด้วย</p>
							
							<h2 className="font-semibold text-on-surface mt-4 text-base">รายละเอียดการติดต่อ</h2>
							<p>หากคุณต้องการสอบถามข้อมูลเกี่ยวกับนโยบายความเป็นส่วนตัวฉบับนี้ รวมถึงการขอใช้สิทธิต่าง ๆ คุณสามารถติดต่อเราหรือเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเราได้ ดังนี้</p>
							
							<p><b>ผู้ควบคุมข้อมูลส่วนบุคคล</b></p>
							<p>ZenMassage</p>
							<p>ชั้น 19 Sky Cafe อาคาร วิศวกรรมศาสตร์ 4 (เจริญวิศวกรรม) ถนนพญาไท วังใหม่ ปทุมวัน กรุงเทพมหานคร 10330</p>
							<p>อีเมล dpo-zenmassage@rachatat.com</p>
							
							<p><b>เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล</b></p>
							<p>DPO Officer</p>
							<p>ชั้น 19 Sky Cafe อาคาร วิศวกรรมศาสตร์ 4 (เจริญวิศวกรรม) ถนนพญาไท วังใหม่ ปทุมวัน กรุงเทพมหานคร 10330</p>
							<p>อีเมล dpo-zenmassage@rachatat.com</p>
							
							<div className="h-4"></div>
						</div>
						
						<footer className="mt-6 flex justify-end gap-3 pt-4 border-t border-outline/10">
							<button
								type="button"
								onClick={() => setIsPolicyModalOpen(false)}
								className="rounded-full px-6 py-2.5 font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									setIsPolicyAccepted(true);
									setIsPolicyModalOpen(false);
								}}
								className="rounded-full bg-primary px-6 py-2.5 font-semibold text-on-primary hover:opacity-90 transition-opacity"
							>
								Accept & Close
							</button>
						</footer>
					</div>
				</div>
			)}
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
