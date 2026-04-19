"use client";

import { useMemo, useState } from "react";
import { MassageShop } from "@/src/types/interface";
import { ShopCard } from "@/src/components/features/shops/shopCard";

type MassageShopsListClientProps = {
  shops: MassageShop[];
  loadError: string | null;
  searchQuery?: string;
  maxDiscount?: number;
};

const SORT_OPTIONS = [
  { value: "rating-desc", label: "Top Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
] as const;

type SortOptionValue = (typeof SORT_OPTIONS)[number]["value"];

export function MassageShopsListClient({
  shops,
  loadError,
  searchQuery = "",
  maxDiscount = 0,
}: MassageShopsListClientProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [sortBy, setSortBy] = useState<SortOptionValue>("rating-desc");
  const hasActiveFilters = searchInput.trim() !== "" || sortBy !== "rating-desc";

  const filteredShops = useMemo(() => {
    const query = searchInput.trim().toLowerCase();

    const visibleShops = query
      ? shops.filter((shop) => {
        const target =
          `${shop.name} ${shop.address} ${shop.district} ${shop.province}`.toLowerCase();
        return target.includes(query);
      })
      : shops;

    return [...visibleShops].sort((left, right) => {
      const leftDiscountedPrice = left.price * (1 - maxDiscount / 100);
      const rightDiscountedPrice = right.price * (1 - maxDiscount / 100);

      if (sortBy === "rating-asc") {
        return left.averageRating - right.averageRating;
      }

      if (sortBy === "price-asc") {
        return leftDiscountedPrice - rightDiscountedPrice;
      }

      if (sortBy === "price-desc") {
        return rightDiscountedPrice - leftDiscountedPrice;
      }

      if (sortBy === "name-asc") {
        return left.name.localeCompare(right.name);
      }

      if (sortBy === "name-desc") {
        return right.name.localeCompare(left.name);
      }

      return right.averageRating - left.averageRating;
    });
  }, [searchInput, shops, sortBy, maxDiscount]);

  const handleReset = () => {
    setSearchInput("");
    setSortBy("rating-desc");
  };

  if (loadError) {
    return (
      <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
        {loadError}
      </p>
    );
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-surface-container-low p-4 md:grid-cols-3">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name, address, district, or province"
          className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-outline"
        />

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOptionValue)}
          aria-label="Sort massage shops"
          className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-between gap-2 md:justify-end">
          <p className="text-sm text-on-surface-variant">{filteredShops.length} shown</p>
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className={`rounded-full border border-outline-variant/30 bg-surface px-4 py-2 text-sm font-medium text-on-surface-variant transition-all ${hasActiveFilters
              ? "hover:border-primary hover:bg-primary-fixed hover:text-on-primary-fixed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95"
              : "cursor-not-allowed opacity-50"
              }`}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-10">
        {filteredShops.length === 0 ? (
          <div className="rounded-xl bg-surface-container-low p-6 text-on-surface-variant">
            No shops matched your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredShops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} maxDiscount={maxDiscount} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}