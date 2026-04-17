import Link from "next/link";
import { MassagesResponse } from "@/src/types/interface";
import { ShopCard } from "@/src/components/features/shops/shopCard";
import { apiBaseUrl } from "@/src/lib/config";
import { MassageShopsListClient } from "@/src/components/features/shops/massageShopsListClient";

export const revalidate = 60;

async function getMassageShops() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/massages?limit=100`, {
      next: { revalidate },
    });

    if (!response.ok) {
      throw new Error("Unable to fetch massage shops.");
    }

    const payload = (await response.json()) as MassagesResponse;
    return { shops: payload.data ?? [], loadError: null as string | null };
  } catch {
    return {
      shops: [],
      loadError:
        "We could not load massage shops right now. Please try again later.",
    };
  }
}

export default async function MassageShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { shops, loadError } = await getMassageShops();
  const params = await searchParams;
  const searchQuery = params.q || "";

  return (
    <section className="bg-surface px-6 py-20 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-on-surface-variant hover:text-primary"
        >
          ← Back to Home
        </Link>

        <h1 className="font-headline text-4xl font-bold text-on-surface">
          Massage Shops
        </h1>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Explore all available massage shops and choose the one that matches your
          preferred location, atmosphere, and budget.
        </p>

        <MassageShopsListClient
          shops={shops}
          loadError={loadError}
          searchQuery={searchQuery}
        />
      </div>
    </section>
  );
}
