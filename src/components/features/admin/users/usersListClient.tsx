"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { AdminUser } from "@/src/types/api";
import CreateAdminUserModal from "./createAdminUserModal";
import { getUserAvatarUrl } from "@/src/lib/avatar";

type CreateAdminActionState = {
  success: boolean;
  message: string | null;
};

type UsersListClientProps = {
  users: AdminUser[];
  totalCount: number;
  hasNextPage: boolean;
  currentUserId: string;
  createAdminAction: (
    state: CreateAdminActionState,
    formData: FormData,
  ) => CreateAdminActionState | Promise<CreateAdminActionState>;
};

function getRoleBadge(role: string) {
  if (role.toLowerCase() === "admin") {
    return {
      label: "Admin",
      className:
        "inline-flex items-center rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed",
    };
  }

  return {
    label: "User",
    className:
      "inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container",
  };
}

function toReadableDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}

export default function UsersListClient({
  users,
  totalCount,
  hasNextPage,
  currentUserId,
  createAdminAction,
}: UsersListClientProps) {
  const [roleFilter, setRoleFilter] = useState("all");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [sortBy, setSortBy] = useState("created-desc");

  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) => {
          if (roleFilter !== "all" && user.role.toLowerCase() !== roleFilter) {
            return false;
          }

          if (keywordFilter) {
            const normalizedKeyword = keywordFilter.toLowerCase();
            const haystack = `${user.name} ${user.email} ${user.tel}`.toLowerCase();
            if (!haystack.includes(normalizedKeyword)) {
              return false;
            }
          }

          return true;
        })
        .map((user) => ({
          ...user,
          resolvedAvatar: getUserAvatarUrl(
            user.avatarUrl,
            user._id ?? user.email ?? user.name,
          ),
        }))
        .sort((first, second) => {
          if (sortBy === "name-asc") {
            return first.name.localeCompare(second.name);
          }

          if (sortBy === "name-desc") {
            return second.name.localeCompare(first.name);
          }

          const firstCreated = new Date(first.createdAt ?? 0).getTime();
          const secondCreated = new Date(second.createdAt ?? 0).getTime();

          if (sortBy === "created-asc") {
            return firstCreated - secondCreated;
          }

          return secondCreated - firstCreated;
        }),
    [keywordFilter, roleFilter, sortBy, users],
  );

  const handleReset = () => {
    setRoleFilter("all");
    setKeywordFilter("");
    setSortBy("created-desc");
  };

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-headline text-4xl leading-tight text-on-surface">All Users</h2>
          <p className="mt-2 max-w-lg text-on-surface-variant">
            Monitor and manage platform users and admin accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
            {filteredUsers.length} of {totalCount} shown
          </div>
          <CreateAdminUserModal action={createAdminAction} />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-surface-container-low p-4 md:grid-cols-3">
        <select
          aria-label="Filter by role"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <input
          type="text"
          value={keywordFilter}
          onChange={(event) => setKeywordFilter(event.target.value)}
          placeholder="Search name, email, or phone"
          className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
        />

        <select
          aria-label="Sort by"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
        >
          <option value="created-desc">Created (newest)</option>
          <option value="created-asc">Created (oldest)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>

        <div className="flex items-center justify-end gap-2 md:col-span-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredUsers.map((user) => {
          const badge = getRoleBadge(user.role);
          if (user._id === currentUserId) {
            badge.label += " (You)";
          }

          return (
            <div
              key={user._id}
              className="group flex flex-col gap-6 rounded-4xl border border-outline-variant/5 bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md xl:flex-row xl:items-center xl:gap-10"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-xl font-bold text-primary">
                <Image
                  src={user.resolvedAvatar}
                  width={50}
                  height={50}
                  alt="User avatar"
                  // unoptimized={true}
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>

              <div className="grid grow grid-cols-1 gap-6 xl:grid-cols-12 xl:items-center xl:gap-8">
                <div className="xl:col-span-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    User
                  </p>
                  <p className="font-semibold text-on-surface">{user.name}</p>
                  <p className="text-xs text-on-surface-variant">{user.email}</p>
                </div>

                <div className="xl:col-span-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Contact
                  </p>
                  <p className="text-sm text-on-surface">{user.tel || "-"}</p>
                </div>

                <div className="xl:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Role
                  </p>
                  <span className={badge.className}>{badge.label}</span>
                </div>

                <div className="xl:col-span-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Joined
                  </p>
                  <p className="text-sm text-on-surface">{toReadableDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="mt-6 rounded-xl bg-surface p-6 text-center text-sm text-on-surface-variant">
          No users found for the selected filters.
        </div>
      )}

      {hasNextPage && (
        <div className="mt-6 rounded-xl bg-surface p-4 text-sm text-on-surface-variant">
          More users are available on the next page.
        </div>
      )}
    </main>
  );
}
