"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MassageShop, Promotion } from "@/src/types/interface";
import { HomeHeroSearch } from "@/src/components/pages/homeHeroSearch";
import { FeaturedShopsSection } from "@/src/components/features/shops/featuredShopsSection";
import { PromotionBanner } from "@/src/components/features/promotion/promotionBanner";

type HomePageClientProps = {
  shops: MassageShop[];
  loadError: string | null;
  maxDiscount?: number;
  promotions: Promotion[]; // 1. Added promotions to Props
};

export function HomePageClient({ 
  shops, 
  loadError, 
  maxDiscount = 0, 
  promotions 
}: HomePageClientProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(true);

  const featuredShops = useMemo(() => shops.slice(0, 3), [shops]);

  const dropdownResults = useMemo(() => {
    const query = searchInput.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return shops
      .filter((shop) => {
        const searchTarget =
          `${shop.name} ${shop.address} ${shop.district} ${shop.province}`.toLowerCase();
        return searchTarget.includes(query);
      })
      .slice(0, 5);
  }, [shops, searchInput]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchInput.trim();
    if (!query) {
      return;
    }

    router.push(`/massage-shops?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <HomeHeroSearch
        searchInput={searchInput}
        isLoading={false}
        loadError={loadError}
        dropdownResults={dropdownResults}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      
      {/* 2. Pass the promotions data into the banner */}
      <PromotionBanner promotions={promotions} /> 
      
      <FeaturedShopsSection
        featuredShops={featuredShops}
        isLoading={false}
        loadError={loadError}
        maxDiscount={maxDiscount}
      />
    </>
  );
}