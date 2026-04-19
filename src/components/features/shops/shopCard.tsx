import Image from "next/image";
import Link from "next/link";
import { MassageShop } from "@/src/types/interface";

type ShopCardProps = {
  shop: MassageShop;
  maxDiscount?: number;
};

export function ShopCard({ shop, maxDiscount = 0 }: ShopCardProps) {
  const discountAmount = shop.price * (maxDiscount / 100);
  const discountedPrice = shop.price - discountAmount;

  return (
    <Link href={`/massage-shops/${shop._id}`} className="block h-full">
      <div className="group flex h-full translate-y-0 flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
        <div className="relative h-64 overflow-hidden">
          <Image
            alt={shop.name}
            fill
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={shop.pictures[0] || "https://picsum.photos/400"}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute right-2 top-4 flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-3 py-1 backdrop-blur">
            <span>
              <img width={14} height={14} src="/star.svg" alt="Star" />
            </span>
            
            <span className="text-sm font-bold">{shop.averageRating === 0 ? "No Ratings" : shop.averageRating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-8">
          <h3 className="mb-1 text-xl font-bold transition-colors group-hover:text-primary">
            {shop.name}
          </h3>
          <p className="flex items-center gap-1 text-sm text-on-surface-variant">
            <span>
              <img width={14} height={14} src="/map-pin.svg" alt="Map pin" />
            </span>
            {shop.district}, {shop.province}
          </p>

          <div className="mt-auto flex items-center justify-between pt-6">
            <div>
              <span className="mb-1 block text-xs uppercase tracking-wider text-outline">
                Starting from
              </span>
              <div className="flex flex-col">
                {maxDiscount > 0 ? (
                  <>
                    <span className="text-sm text-on-surface-variant line-through">
                      {shop.price.toLocaleString()} Baht
                    </span>
                    <span className="font-headline text-2xl font-bold text-primary">
                      {discountedPrice.toLocaleString()} Baht
                    </span>
                  </>
                ) : (
                  <span className="font-headline text-2xl font-bold text-primary">
                    {shop.price.toLocaleString()} Baht
                  </span>
                )}
              </div>
            </div>
            {maxDiscount > 0 && (
              <span className="rounded-full bg-error px-2 py-1 text-xs font-bold text-on-error">
                -{maxDiscount}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}