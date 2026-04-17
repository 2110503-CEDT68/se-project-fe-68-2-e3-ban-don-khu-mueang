import { MassageShop } from "@/src/types/interface";
import { ShopCard } from "@/src/components/features/shops/shopCard";

type FeaturedShopsSectionProps = {
  featuredShops: MassageShop[];
  isLoading: boolean;
  loadError: string | null;
};

export function FeaturedShopsSection({
  featuredShops,
  isLoading,
  loadError,
}: FeaturedShopsSectionProps) {
  return (
    <section className="bg-surface px-6 py-24 lg:px-20">
      <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-4">
          <h2 className="font-headline text-4xl font-bold text-on-surface">
            Featured Shops
          </h2>
          <p className="max-w-md text-on-surface-variant">
            The top rated massage shops, rated by our users. Handpicked for
            quality, ambiance, and unforgettable experiences.
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-on-surface-variant">Loading massage shops...</p>
      ) : loadError ? (
        <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          {loadError}
        </p>
      ) : featuredShops.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low p-6 text-on-surface-variant">
          No massage shops available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredShops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      )}
    </section>
  );
}