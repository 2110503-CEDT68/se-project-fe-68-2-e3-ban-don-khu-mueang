import Image from "next/image";
import Link from "next/link";

export interface PromotionItem {
  id: string;
  tagline: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

interface PromotionCardProps {
  promotion: PromotionItem;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between w-full h-full text-[var(--on-primary)]">
      <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-24 z-10 flex flex-col items-start justify-center">
        <span className="uppercase tracking-widest text-sm font-semibold text-[var(--primary-fixed)] mb-4">
          {promotion.tagline}
        </span>
        <h2 className="font-serif text-[var(--on-primary)] text-4xl lg:text-5xl leading-tight mb-6 max-w-lg">
          {promotion.title}
        </h2>
        <p className="font-sans text-[var(--on-primary-container)] text-lg mb-10 max-w-md opacity-90 leading-relaxed">
          {promotion.description}
        </p>
        <Link
          href={promotion.ctaLink}
          className="inline-block px-8 py-3.5 rounded-full bg-[var(--surface-container-highest)] text-[#4E6053] font-medium text-base hover:bg-[var(--surface-container-lowest)] transition-colors shadow-sm"
        >
          {promotion.ctaText}
        </Link>
      </div>

      {/* Asymmetrical elegant image masking */}
      <div className="w-full md:w-[55%] h-[350px] md:h-full md:absolute md:right-0 md:top-0 bottom-0 overflow-hidden md:rounded-l-[4rem]">
        <div className="relative w-full h-full min-h-[350px]">
          <Image
            src={promotion.imageUrl}
            alt={promotion.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Soft gradient overlay to blend into primary container smoothly */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--primary)] to-transparent pointer-events-none" />
          <div className="md:hidden absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--primary)] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
