"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState, useState } from "react";
import type { AdminShop } from "@/src/types/api";
import formatPhoneNumber from "@/src/lib/admin/formatPhoneNumber";
import ShopImageManager from "../../shops/shopImageManager";

type ShopActionState = {
  success: boolean;
  message: string | null;
};

type EditShopFormProps = {
  shop: AdminShop;
  uploadToken: string;
  updateAction: (
    state: ShopActionState,
    formData: FormData,
  ) => ShopActionState | Promise<ShopActionState>;
  deleteAction: (
    state: ShopActionState,
    formData: FormData,
  ) => ShopActionState | Promise<ShopActionState>;
};

const initialActionState: ShopActionState = {
  success: false,
  message: null,
};

// const unavailableDescription =
//   "Description is shown in the design, but the current backend contract does not expose a description field for massage shops yet.";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function EditShopForm({
  shop,
  uploadToken,
  updateAction,
  deleteAction,
}: EditShopFormProps) {
  const [updateState, updateFormAction, isUpdatePending] = useActionState(
    updateAction,
    initialActionState,
  );
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteAction,
    initialActionState,
  );
  const [tel, setTel] = useState(shop.tel);
  const [imageUrls, setImageUrls] = useState<string[]>(shop.pictures ?? []);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const heroImage = imageUrls[0] || "https://placehold.co/600x400?text=No+Image";
  const rating =
    typeof shop.averageRating === "number" ? shop.averageRating.toFixed(1) : "N/A";
  const reviewCount = shop.userRatingCount ?? 0;

  return (
    <main className="flex-1 bg-surface px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <form action={updateFormAction} className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <nav className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant/70">
              <span>Management</span>
              <span>/</span>
              <span>Shops</span>
              <span>/</span>
              <span className="text-primary">Shop Editor</span>
            </nav>
            <h2 className="text-4xl font-headline font-bold tracking-tight text-on-surface">
              {shop.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant sm:text-base">
              Update the shop profile, pricing, location details, and gallery assets from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/shops"
              className="rounded-full border border-outline-variant/40 px-6 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Discard Changes
            </Link>
            <button
              type="submit"
              disabled={isUpdatePending}
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-on-primary shadow-lg shadow-primary/10 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatePending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {updateState.message ? (
          <div className="rounded-xl border border-error/20 bg-error-container/40 px-4 py-3 text-sm text-on-error-container">
            {updateState.message}
          </div>
        ) : null}

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-8 xl:col-span-8">
            <section className="rounded-xl bg-surface-container-low p-8">
              <div className="mb-6 flex items-center gap-3">
                {/* <span className="material-symbols-outlined text-primary">auto_awesome</span> */}
                <h3 className="text-xl font-headline font-bold text-on-surface">Shop Identity</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <label className="space-y-2">
                  <span className="pl-1 text-sm font-semibold text-on-surface-variant">Shop Name</span>
                  <input
                    name="name"
                    required
                    defaultValue={shop.name}
                    className="w-full rounded-lg border border-transparent bg-surface-container-lowest p-4 text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                {/* <label className="space-y-2">
                  <span className="pl-1 text-sm font-semibold text-on-surface-variant">Description</span>
                  <textarea
                    disabled
                    rows={5}
                    value={unavailableDescription}
                    className="w-full resize-none rounded-lg border border-transparent bg-surface-container-lowest p-4 text-sm text-on-surface-variant outline-none"
                  />
                </label> */}
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-8">
              <div className="mb-6 flex items-center gap-3">
                {/* <span className="material-symbols-outlined text-primary">location_on</span> */}
                <h3 className="text-xl font-headline font-bold text-on-surface">Location Details</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="pl-1 text-sm font-semibold text-on-surface-variant">Full Street Address</span>
                  <input
                    name="address"
                    required
                    defaultValue={shop.address}
                    className="w-full rounded-lg border border-transparent bg-surface-container-lowest p-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="pl-1 text-sm font-semibold text-on-surface-variant">District</span>
                  <input
                    name="district"
                    required
                    defaultValue={shop.district}
                    className="w-full rounded-lg border border-transparent bg-surface-container-lowest p-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="pl-1 text-sm font-semibold text-on-surface-variant">Province</span>
                  <input
                    name="province"
                    required
                    defaultValue={shop.province}
                    className="w-full rounded-lg border border-transparent bg-surface-container-lowest p-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="pl-1 text-sm font-semibold text-on-surface-variant">Postal Code</span>
                  <input
                    name="postalcode"
                    required
                    defaultValue={shop.postalcode}
                    inputMode="numeric"
                    maxLength={5}
                    pattern="[0-9]{5}"
                    className="w-full rounded-lg border border-transparent bg-surface-container-lowest p-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="pl-1 text-sm font-semibold text-on-surface-variant">Telephone Number</span>
                  <input
                    name="tel"
                    required
                    value={tel}
                    onChange={(event) => setTel(formatPhoneNumber(event.target.value))}
                    inputMode="numeric"
                    maxLength={12}
                    pattern="[0-9]{2,3}-[0-9]{3}-[0-9]{4}"
                    placeholder="02-123-4567 or 081-234-5678"
                    className="w-full rounded-lg border border-transparent bg-surface-container-lowest p-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>
            </section>

            <ShopImageManager
              initialImages={shop.pictures}
              onImagesChange={setImageUrls}
              variant="gallery"
              sectionTitle="Gallery Management"
              sectionDescription="Use the shared image editor to add, replace, or remove gallery URLs. Broken previews are flagged without losing the saved URL."
              addLabel="Add Media"
              emptyStateLabel="No gallery media has been added yet. Start by uploading the first image URL."
              uploadToken={uploadToken}
              massageId={shop._id}
            />
          </div>

          <div className="col-span-12 space-y-8 xl:col-span-4">
            <section className="rounded-xl bg-surface-container-low p-8">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Shop Logo
              </h3>

              <div className="flex flex-col items-center">
                <div className="relative mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-primary-fixed">
                  <Image
                    src={heroImage}
                    fill
                    alt={`${shop.name} primary preview`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/15" />
                </div>
                <p className="text-center text-xs font-semibold text-primary">
                  Primary gallery image is used as the brand preview.
                </p>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-low p-8">
              <div className="space-y-6">
                <label className="space-y-2">
                  <span className="pl-1 text-sm font-semibold text-on-surface-variant">Base Price (per session)</span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center font-headline text-lg font-bold text-on-surface-variant">
                      ฿
                    </span>
                    <input
                      name="price"
                      required
                      type="number"
                      inputMode="numeric"
                      min={0}
                      defaultValue={shop.price}
                      className="w-full rounded-lg border border-transparent bg-surface-container-lowest p-4 pl-10 text-xl font-bold text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </label>

                <div className="border-t border-surface-variant/50 pt-4">
                  <p className="pl-1 text-sm font-semibold text-on-surface-variant">Public Rating</p>
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-surface-container-lowest p-4">
                    <span className="material-symbols-outlined text-yellow-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                      <img src="/star-yellow.svg" alt="" />
                    </span>
                    <span className="text-xl font-bold text-on-surface">{rating}</span>
                    <span className="text-xs text-on-surface-variant">
                      ({reviewCount} Reviews)
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] italic text-on-surface-variant/70">
                    Rating is read-only and comes from customer feedback.
                  </p>
                </div>

                <div className="rounded-lg bg-surface-container-lowest p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant/70">
                    Current Gallery
                  </p>
                  <p className="mt-2 text-2xl font-headline font-bold text-primary">
                    {imageUrls.length}
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {imageUrls.length === 1 ? "image linked" : "images linked"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-error/20 bg-error-container/10 p-8">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-error">
                Danger Zone
              </h3>
              <p className="mb-6 text-sm text-on-surface-variant">
                Permanently remove this shop from the platform. This action cannot be undone.
              </p>

              {deleteState.message ? (
                <div className="mb-4 rounded-xl border border-error/20 bg-error-container/50 px-4 py-3 text-sm text-on-error-container">
                  {deleteState.message}
                </div>
              ) : null}

              {!isDeleteConfirmOpen ? (
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="w-full rounded-full border border-error py-3 text-sm font-bold text-error transition-colors hover:bg-error hover:text-on-error"
                >
                  Delete Shop
                </button>
              ) : (
                <div className="space-y-3 rounded-xl border border-error/20 bg-surface px-4 py-4">
                  <p className="text-sm font-semibold text-on-surface">Delete {shop.name}?</p>
                  <p className="text-xs leading-5 text-on-surface-variant">
                    Confirming this will remove the shop and its related admin record immediately.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      className="flex-1 rounded-full border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant"
                    >
                      Cancel
                    </button>
                    <button
                      formAction={deleteFormAction}
                      disabled={isDeletePending}
                      className="flex-1 rounded-full bg-error px-4 py-2 text-sm font-semibold text-on-error transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletePending ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-outline-variant/10 pt-6">
          <Link
            href="/admin/shops"
            className="rounded-full border border-outline-variant/40 px-6 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            Back to Shops
          </Link>
          <button
            type="submit"
            disabled={isUpdatePending}
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatePending ? "Saving..." : `Save Changes`}
          </button>
        </div>
      </form>
    </main>
  );
}