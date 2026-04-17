"use client";

import { useActionState, useState } from "react";
import formatPhoneNumber from "@/src/lib/admin/formatPhoneNumber";

type CreateAdminActionState = {
  success: boolean;
  message: string | null;
};

type CreateAdminUserModalProps = {
  action: (
    state: CreateAdminActionState,
    formData: FormData,
  ) => CreateAdminActionState | Promise<CreateAdminActionState>;
  modalId?: string;
};

const initialActionState: CreateAdminActionState = {
  success: false,
  message: null,
};

export default function CreateAdminUserModal({
  action,
  modalId = "create-user-modal",
}: CreateAdminUserModalProps) {
  const [actionState, formAction, isPending] = useActionState(
    action,
    initialActionState,
  );
  const [tel, setTel] = useState("");

  return (
    <>
      <input id={modalId} type="checkbox" className="peer hidden" />
      <label
        htmlFor={modalId}
        className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
      >
        Create Admin User
      </label>

      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100">
        <div className="w-full max-w-xl rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <div className="mb-4 flex items-center justify-between">
            <h5 className="font-headline text-xl text-on-surface">Create New Admin User</h5>
            <label
              htmlFor={modalId}
              className="cursor-pointer rounded-full border border-outline-variant/30 px-3 py-1 text-xs text-on-surface-variant"
            >
              Close
            </label>
          </div>

          <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {actionState.message && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm md:col-span-2 ${
                  actionState.success
                    ? "border-primary/20 bg-primary-fixed/40 text-on-surface"
                    : "border-error/30 bg-error-container/30 text-error"
                }`}
              >
                {actionState.message}
              </div>
            )}

            <input
              name="name"
              required
              placeholder="Full name"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
            />
            <input
              name="tel"
              required
              value={tel}
              onChange={(event) => setTel(formatPhoneNumber(event.target.value))}
              placeholder="02-123-4567 or 081-234-5678"
              inputMode="numeric"
              maxLength={12}
              pattern="[0-9]{2,3}-[0-9]{3}-[0-9]{4}"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm"
            />
            <input
              name="email"
              required
              type="email"
              placeholder="Email"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm md:col-span-2"
            />
            <input
              name="password"
              required
              type="password"
              placeholder="Password"
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm md:col-span-2"
            />
            <div className="flex justify-end gap-2 md:col-span-2">
              <label
                htmlFor={modalId}
                className="cursor-pointer rounded-full border border-outline-variant/30 px-5 py-2 text-sm text-on-surface-variant"
              >
                Cancel
              </label>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-primary px-8 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
              >
                {isPending ? "Creating..." : "Create Admin User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}