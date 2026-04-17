import Image from "next/image";
import Link from "next/link";
import { MassageShop } from "@/src/types/interface";

type HomeHeroSearchProps = {
  searchInput: string;
  isLoading: boolean;
  loadError: string | null;
  dropdownResults: MassageShop[];
  onSearchChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function HomeHeroSearch({
  searchInput,
  isLoading,
  loadError,
  dropdownResults,
  onSearchChange,
  onSearchSubmit,
}: HomeHeroSearchProps) {
  return (
    <section className="relative h-[95vh] min-h-[85vh] items-center px-6 py-20 lg:px-20"> {/* overflow-hidden is to prevent the image from overflowing */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Minimal spa environment with calming colors and soft textures"
          className="h-full w-full object-cover"
          width={1000}
          height={1000}
          src="https://fe-storage.rachatat.com/home-banner-2.jpg"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent" />
      </div>
      <div className="relative z-10 max-w-2xl">
        <h1 className="mb-6 font-headline text-5xl font-bold leading-tight text-on-surface lg:text-7xl">
          Your Journey to <span className="italic text-primary">Stillness</span>{" "}
          Begins Here.
        </h1>
        <p className="mb-10 max-w-lg text-lg leading-relaxed text-on-surface-variant">
          Discover curated sanctuary spaces designed to restore your rhythm and
          revitalize your spirit. Hand-picked therapists, ethereal
          environments.
        </p>

        <div className="relative max-w-xl">
          <form
            onSubmit={onSearchSubmit}
            className="flex flex-col gap-2 rounded-xl bg-surface-container-lowest p-2 shadow-[0_8px_32px_rgb(26_28_24/0.05)] md:flex-row"
          >
            <div className="flex flex-1 items-center rounded-lg bg-surface-container-low px-4 py-3 transition-all focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-outline-variant/40">
              <span className="mr-3 text-outline">
                <img width={20} height={20} src="/search.svg" alt="Search" />
              </span>
              <input
                className="w-full border-none bg-transparent text-sm placeholder:text-outline focus:ring-0"
                placeholder="Location or treatment..."
                type="text"
                value={searchInput}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-primary px-8 py-4 text-sm font-bold tracking-wide text-on-primary transition-colors hover:bg-primary-container"
            >
              Explore Treatments
            </button>
          </form>

          {searchInput.trim() ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_8px_32px_rgb(26_28_24/0.1)]">
              {isLoading ? (
                <p className="px-4 py-3 text-sm text-on-surface-variant">
                  Searching...
                </p>
              ) : loadError ? (
                <p className="px-4 py-3 text-sm text-on-error-container">
                  Unable to load search results.
                </p>
              ) : dropdownResults.length === 0 ? (
                <p className="px-4 py-3 text-sm text-on-surface-variant">
                  No matching shops found.
                </p>
              ) : (
                <ul className="divide-y divide-surface-container-high">
                  {dropdownResults.slice(0, 3).map((shop) => (
                    <li key={shop._id}>
                      <Link
                        href={`/massage-shops/${shop._id}`}
                        className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-container-low"
                      >
                        <div>
                          <p className="text-sm font-semibold text-on-surface">
                            {shop.name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {shop.district}, {shop.province}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-primary">
                          {shop.averageRating.toFixed(1)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <div className="border-t border-surface-container-high px-4 py-3">
                <Link
                  href={`/massage-shops?q=${encodeURIComponent(searchInput.trim())}`}
                  className="inline-flex items-center text-sm font-bold text-primary transition-colors hover:text-primary-container"
                >
                  See more
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}