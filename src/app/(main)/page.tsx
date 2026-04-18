import { MassagesResponse } from "@/src/types/interface";
import { apiBaseUrl } from "@/src/lib/config";
import { HomePageClient } from "@/src/components/pages/homePageClient";
import { getMaxActiveDiscount } from "@/src/lib/promotion/getMaxDiscount";

export const revalidate = 60;

async function getMainPageShops() {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/massages?sort=-averageRating&limit=60`,
      {
        next: { revalidate },
      },
    );

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

type SearchParams = Record<string, string | string[] | undefined>;

function getErrorMessage(params: SearchParams): string | null {
  const error = params.error;
  if (typeof error === "string") {
    return decodeURIComponent(error);
  }
  if (Array.isArray(error)) {
    return decodeURIComponent(error[0] ?? "");
  }
  return null;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const resolvedSearchParams =
    searchParams instanceof Promise ? await searchParams : (searchParams ?? {});

  const [{ shops, loadError }, maxDiscount] = await Promise.all([
    getMainPageShops(),
    getMaxActiveDiscount()
  ]);
  
  const authError = getErrorMessage(resolvedSearchParams);
  const displayError = authError || loadError;

  return <HomePageClient shops={shops} loadError={displayError} maxDiscount={maxDiscount} />;
}
