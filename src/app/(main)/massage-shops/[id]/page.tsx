import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MassageShop } from "@/src/types/interface";
import getShopById from "@/src/lib/shop/getShopById";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";

type MassageShopDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const FALLBACK_IMAGE = "https://picsum.photos/1200/900";

function getPicture(pictures: string[], index: number) {
  return pictures[index] ?? FALLBACK_IMAGE;
}

export default async function MassageShopDetailPage({
  params,
}: MassageShopDetailPageProps) {
  const { id } = await params;
  const { session } = await getSessionAuthContext();
  const response = await getShopById<MassageShop>(id);

  if (!response?.data) {
    notFound();
  }

  const shop = response.data;
  const pictures = shop.pictures?.length ? shop.pictures : [FALLBACK_IMAGE];
  const isSignedIn = Boolean(session?.user);

  return (
    <section className="bg-surface px-6 py-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-on-surface-variant hover:text-primary"
        >
          ← Back to Home
        </Link>

        <div className="grid h-[560px] grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
          <div className="relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2">
            <Image
              src={getPicture(pictures, 0)}
              alt={shop.name}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="font-headline text-4xl font-bold lg:text-5xl">
                {shop.name}
              </h1>
              <p className="mt-2 text-lg opacity-90">
                {shop.district}, {shop.province}
              </p>
            </div>
          </div>

          {[1, 2].map((index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl">
              <Image
                src={getPicture(pictures, index)}
                alt={`${shop.name} image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 25vw, 100vw"
              />
            </div>
          ))}

          <div className="relative overflow-hidden rounded-2xl md:col-span-2">
            <Image
              src={getPicture(pictures, 3)}
              alt={`${shop.name} image 4`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 md:grid-cols-3">
          <div className="rounded-2xl bg-surface-container-low p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-outline">
              Location
            </p>
            <p className="mt-3 text-on-surface-variant">
              {shop.address}
              <br />
              {shop.district}, {shop.province} {shop.postalcode}
            </p>
          </div>

          <div className="rounded-2xl bg-surface-container-low p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-outline">
              Contact
            </p>
            <p className="mt-3 text-on-surface-variant">{shop.tel}</p>
            <p className="mt-1 text-sm text-outline">Open daily: 9:00 AM - 10:00 PM</p>
          </div>

          <div className="rounded-2xl bg-surface-container-low p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-outline">
              Starting Price
            </p>
            <p className="mt-3 font-headline text-3xl text-primary">
              {shop.price.toLocaleString()} Baht
            </p>
            <p className="mt-1 text-sm text-outline">
              Rating {shop.averageRating} ({shop.userRatingCount} reviews)
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section>
              <h2 className="font-headline text-3xl text-on-surface">About This Shop</h2>
              <p className="mt-5 leading-relaxed text-on-surface-variant">
                {shop.name} provides personalized massage services in {shop.district},
                {" "}
                {shop.province}. The shop focuses on comfort, attentive service, and a
                relaxing environment for both short visits and longer wellness sessions.
              </p>
              <p className="mt-4 leading-relaxed text-on-surface-variant">
                Before your session, contact the shop directly for treatment availability,
                preferred therapist requests, and same-day booking options.
              </p>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-3xl bg-primary p-8 text-center text-on-primary">
              <h3 className="font-headline text-3xl">Ready to Relax?</h3>
              <p className="mt-3 text-primary-fixed">
                {isSignedIn
                  ? "Continue to your booking flow."
                  : "Sign in to continue with your booking flow."}
              </p>
              <Link
                href={isSignedIn ? `/booking?id=${shop.id}&name=${encodeURIComponent(shop.name)}&price=${shop.price}` : `/login?callbackUrl=${encodeURIComponent(`/booking?id=${shop.id}&name=${encodeURIComponent(shop.name)}&price=${shop.price}`)}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-base font-bold text-primary transition-opacity hover:opacity-90"
              >
                {isSignedIn ? "Book Now" : "Sign In to Book"}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
