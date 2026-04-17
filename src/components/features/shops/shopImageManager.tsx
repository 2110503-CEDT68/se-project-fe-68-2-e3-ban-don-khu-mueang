"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ShopImageUrlDialog from "./shopImageUrlDialog";

const EMPTY_IMAGES: string[] = [];

type ShopImageManagerProps = {
  initialImages?: string[];
  inputName?: string;
  onImagesChange?: (images: string[]) => void;
  variant?: "list" | "gallery";
  sectionTitle?: string;
  sectionDescription?: string;
  addLabel?: string;
  emptyStateLabel?: string;
  maxImages?: number;
};

const fallbackPreview = "https://placehold.co/600x400?text=Preview+Unavailable";

function validateImageUrl(
  value: string,
  imageUrls: string[],
  editingIndex: number | null,
) {
  if (!value) {
    return "Image URL is required.";
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    return "Enter a valid absolute image URL.";
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return "Only http and https image URLs are supported.";
  }

  const isDuplicate = imageUrls.some((imageUrl, index) => {
    if (editingIndex !== null && index === editingIndex) {
      return false;
    }

    return imageUrl === value;
  });

  if (isDuplicate) {
    return "This image URL is already in the gallery.";
  }

  return null;
}

export default function ShopImageManager({
  initialImages = EMPTY_IMAGES,
  inputName = "pictures",
  onImagesChange,
  variant = "list",
  sectionTitle = "Images",
  sectionDescription,
  addLabel = "Add Image",
  emptyStateLabel = "No images added yet.",
  maxImages,
}: ShopImageManagerProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [draftUrl, setDraftUrl] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    onImagesChange?.(imageUrls);
  }, [imageUrls, onImagesChange]);

  const imageLimitReached = typeof maxImages === "number" && imageUrls.length >= maxImages;

  const openAddDialog = () => {
    if (imageLimitReached) {
      return;
    }

    setEditingIndex(null);
    setDraftUrl("");
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setDraftUrl(imageUrls[index] ?? "");
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingIndex(null);
    setDraftUrl("");
    setDialogError(null);
  };

  const handleSaveImage = () => {
    const trimmedUrl = draftUrl.trim();
    const validationError = validateImageUrl(trimmedUrl, imageUrls, editingIndex);

    if (validationError) {
      setDialogError(validationError);
      return;
    }

    setImageUrls((currentImages) => {
      if (editingIndex === null) {
        return [...currentImages, trimmedUrl];
      }

      return currentImages.map((imageUrl, index) => {
        if (index === editingIndex) {
          return trimmedUrl;
        }

        return imageUrl;
      });
    });

    setFailedImages((currentFailedImages) => {
      if (editingIndex === null) {
        return currentFailedImages;
      }

      const nextFailedImages = { ...currentFailedImages };
      delete nextFailedImages[editingIndex];
      return nextFailedImages;
    });

    closeDialog();
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((currentImages) =>
      currentImages.filter((_, index) => index !== indexToRemove),
    );

    setFailedImages((currentFailedImages) => {
      const nextFailedImages: Record<number, boolean> = {};

      Object.entries(currentFailedImages).forEach(([key, value]) => {
        const index = Number(key);

        if (index < indexToRemove) {
          nextFailedImages[index] = value;
        }

        if (index > indexToRemove) {
          nextFailedImages[index - 1] = value;
        }
      });

      return nextFailedImages;
    });
  };

  const markImageFailed = (index: number) => {
    setFailedImages((currentFailedImages) => ({
      ...currentFailedImages,
      [index]: true,
    }));
  };

  return (
    <>
      <section className="rounded-xl bg-surface-container-low p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-headline font-bold text-on-surface">{sectionTitle}</h3>
            {sectionDescription ? (
              <p className="mt-2 text-sm text-on-surface-variant">{sectionDescription}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={openAddDialog}
            disabled={imageLimitReached}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:border-outline-variant disabled:text-on-surface-variant disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-lg"><img src="/circle-plus-dark.svg" alt="" /></span>
            {addLabel}
          </button>
        </div>

        {variant === "gallery" ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {imageUrls.map((url, index) => {
              const previewFailed = failedImages[index];

              return (
                <div
                  key={`${url}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest"
                >
                  {previewFailed ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface px-4 text-center">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                        <img src="/image-off.svg" alt="" />
                      </span>
                      <p className="text-xs font-semibold text-on-surface">Preview unavailable</p>
                      <p className="text-[11px] leading-4 text-on-surface-variant">
                        The URL is still saved and will be submitted.
                      </p>
                    </div>
                  ) : (
                    <Image
                      src={url}
                      fill
                      alt={`Shop image ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => markImageFailed(index)}
                    />
                  )}

                  <div className="absolute inset-0 flex items-end justify-between bg-black/0 p-3 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                    <span className="max-w-[70%] truncate text-xs font-medium text-white">
                      Image {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditDialog(index)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35"
                        aria-label={`Edit image ${index + 1}`}
                      >
                        <span className="material-symbols-outlined text-lg"><img src="/pencil-white.svg" alt="" /></span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-red-500/70"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <span className="material-symbols-outlined text-lg"><img src="/trash-2.svg" alt="" />
                        </span>
                      </button>
                    </div>
                  </div>

                  <input type="hidden" name={inputName} value={url} />
                </div>
              );
            })}

            {!imageLimitReached ? (
              <button
                type="button"
                onClick={openAddDialog}
                className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container/50 text-on-surface-variant transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-3xl"><img src="/circle-plus-dark.svg" alt="" /></span>
                <span className="mt-2 text-[11px] font-bold tracking-[0.16em]">ADD</span>
              </button>
            ) : null}

            {imageUrls.length === 0 ? (
              <div className="col-span-full rounded-xl border border-outline-variant/20 bg-surface px-5 py-4 text-sm text-on-surface-variant">
                {emptyStateLabel}
              </div>
            ) : null}
          </div>
        ) : imageUrls.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline-variant/40 bg-surface px-5 py-6 text-sm text-on-surface-variant">
            {emptyStateLabel}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {imageUrls.map((url, index) => {
              const previewFailed = failedImages[index];

              return (
                <div
                  key={`${url}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface p-3"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-high">
                    {previewFailed ? (
                      <img
                        src={fallbackPreview}
                        alt="Preview unavailable"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Shop image ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={() => markImageFailed(index)}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-on-surface">Image {index + 1}</p>
                    <p className="truncate text-xs text-on-surface-variant">{url}</p>
                    {previewFailed ? (
                      <p className="mt-1 text-[11px] text-error">Preview failed, but the URL will still be submitted.</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditDialog(index)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-fixed"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-error transition-colors hover:bg-error-container"
                    >
                      Remove
                    </button>
                  </div>
                  <input type="hidden" name={inputName} value={url} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ShopImageUrlDialog
        isOpen={isDialogOpen}
        draftUrl={draftUrl}
        editingIndex={editingIndex}
        dialogError={dialogError}
        onClose={closeDialog}
        onSave={handleSaveImage}
        onDraftChange={(value) => {
          setDraftUrl(value);
          if (dialogError) {
            setDialogError(null);
          }
        }}
      />
    </>
  );
}