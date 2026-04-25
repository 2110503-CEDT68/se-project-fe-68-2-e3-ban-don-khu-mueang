"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import formatPhoneNumber from "@/src/lib/admin/formatPhoneNumber";
import ShopImageManager from "./shopImageManager";

type CreateShopActionState = {
  success: boolean;
  message: string | null;
};

type CreateShopFormProps = {
  uploadToken: string;
  action: (
    state: CreateShopActionState,
    formData: FormData,
  ) => CreateShopActionState | Promise<CreateShopActionState>;
};

const initialActionState: CreateShopActionState = {
  success: false,
  message: null,
};

export default function CreateShopForm({ action, uploadToken }: CreateShopFormProps) {
  const [actionState, formAction, isPending] = useActionState(
    action,
    initialActionState,
  );
  const [tel, setTel] = useState("");

  return (
    <main className="mx-auto w-full max-w-4xl p-6 md:p-10">
      <section className="mb-8 space-y-2">
        <h2 className="text-3xl font-headline text-on-surface">Create New Shop</h2>
        <p className="text-sm text-on-surface-variant">
          Fill in shop information and add image URLs.
        </p>
      </section>

      <form action={formAction} className="space-y-8">
        {actionState.message && (
          <div className="rounded-xl border border-error/40 bg-error-container/30 px-4 py-3 text-sm text-error">
            {actionState.message}
          </div>
        )}

        <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <h3 className="mb-4 text-lg font-headline text-on-surface">Shop Info</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Shop name"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
            />
            <input
              name="tel"
              required
              value={tel}
              onChange={(event) => setTel(formatPhoneNumber(event.target.value))}
              placeholder="Phone (02-123-4567 or 081-234-5678)"
              inputMode="numeric"
              maxLength={12}
              pattern="[0-9]{2,3}-[0-9]{3}-[0-9]{4}"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
            />
            <input
              name="address"
              required
              placeholder="Address"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm md:col-span-2"
            />
            <input
              name="district"
              required
              placeholder="District"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
            />
            <input
              name="province"
              required
              placeholder="Province"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
            />
            <input
              name="postalcode"
              required
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]{5}"
              placeholder="Postal code"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
            />
            <input
              name="price"
              required
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Price"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
            />
          </div>
        </section>

        <ShopImageManager
          sectionTitle="Images"
          sectionDescription="Add image URLs, correct bad ones, and remove anything you do not want submitted."
          emptyStateLabel="No images added yet. Add at least one image to improve the listing preview."
          uploadToken={uploadToken}
        />

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/shops"
            className="rounded-full border border-outline-variant/30 px-6 py-2 text-sm text-on-surface-variant"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
          >
            {isPending ? "Creating..." : "Create Shop"}
          </button>
        </div>
      </form>
    </main>
  );
}
