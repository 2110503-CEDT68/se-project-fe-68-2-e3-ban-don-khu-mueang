import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
// 1. Import the class instead of the standalone functions
import { AdminApiClient } from "@/src/lib/admin/adminApiClient";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";

export default async function ManageShopsPage() {
  const { session } = await requireAdminAuth();
  const token = session?.user?.token as string;

  const api = new AdminApiClient(token);

  const shopsResponse = await api.getShops().catch(() => ({
    success: false,
    count: 0,
    data: [],
  }));

  async function deleteShopAction(formData: FormData) {
    "use server";

    const { session: actionSession } = await requireAdminAuth();
    const actionToken = actionSession?.user?.token as string;

    const actionApi = new AdminApiClient(actionToken);

    const shopId = String(formData.get("shopId") ?? "").trim();

    if (!shopId) {
      return;
    }

    await actionApi.deleteShop(shopId);
    revalidatePath("/admin/shops");
  }

  return (
    <section className="mx-auto max-w-8xl space-y-12 p-6 md:p-12">
      <div className="flex items-end justify-between">
        <div className="max-w-xl">
          <h3 className="mb-4 text-4xl font-headline text-on-surface">Manage Shops</h3>
        </div>
        <Link
          href="/admin/shops/create"
          className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-on-primary shadow-lg transition-all hover:bg-primary-container"
        >
          <span className="material-symbols-outlined">
            <img src="/circle-plus.svg" alt="" />
          </span>
          <span className="font-medium tracking-wide">Add New Shop</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {shopsResponse.data.map((shop) => {
          const deleteModalId = `delete-shop-${shop._id}`;

          return (
            <div
              key={shop._id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest transition-all duration-500 hover:shadow-xl sm:flex-row"
            >
              <div className="relative h-48 w-full overflow-hidden sm:h-auto sm:w-48">
                <Image
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={shop.pictures[0] || "https://placehold.co/600x400?text=No+Image"}
                  alt={`${shop.name} cover`}
                  fill
                  // width={500}
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 mix-blend-multiply transition-opacity group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-xl font-headline text-primary">{shop.name}</h4>
                    <div className="flex items-center gap-1 rounded-lg bg-tertiary-fixed/30 px-2 py-1">
                      <span className="material-symbols-outlined text-sm text-tertiary">
                        <img width={14} src="/star.svg" alt="" />
                      </span>
                      <span className="text-xs font-bold text-tertiary">
                        {shop.averageRating === 0 ? "No Ratings" : shop.averageRating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">
                      <img src="/map-pin.svg" alt="" />
                    </span>
                    <span>{shop.address || "Location not specified"}</span>
                  </div>
                  <div className="mb-4 text-lg font-headline text-primary">
                    {shop.price ? shop.price.toLocaleString() : "Price range not specified"} THB
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/admin/shops/${shop._id}/edit`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-surface-container-highest py-2 text-sm font-medium text-on-surface transition-colors hover:bg-secondary-fixed-dim"
                  >
                    <span className="material-symbols-outlined text-lg">
                      <img src="/pencil.svg" alt="" />
                    </span>
                    Edit
                  </Link>
                  <input id={deleteModalId} type="checkbox" className="peer hidden" />
                  <label
                    htmlFor={deleteModalId}
                    className="cursor-pointer rounded-lg bg-error-container/50 px-3 py-2 text-error transition-colors hover:bg-error-container"
                    aria-label={`Delete ${shop.name}`}
                  >
                    <span className="material-symbols-outlined">
                      <img src="/trash-2.svg" alt="" />
                    </span>
                  </label>
                  <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 opacity-0 transition-opacity duration-200 peer-checked:pointer-events-auto peer-checked:opacity-100">
                    <div className="w-full max-w-md rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-2xl">
                      <div className="space-y-3">
                        <p className="text-lg font-headline text-on-surface">Delete shop?</p>
                        <p className="text-sm leading-relaxed text-on-surface-variant">
                          This will permanently remove {shop.name} from the admin dashboard.
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-end gap-3">
                        <label
                          htmlFor={deleteModalId}
                          className="cursor-pointer rounded-full border border-outline-variant/30 px-5 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
                        >
                          Cancel
                        </label>
                        <form action={deleteShopAction}>
                          <input type="hidden" name="shopId" value={shop._id} />
                          <button
                            type="submit"
                            className="cursor-pointer rounded-full bg-error px-5 py-2 text-sm font-semibold text-on-error transition-opacity hover:opacity-90"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {shopsResponse.data.length === 0 ? (
        <div className="rounded-xl bg-surface p-6 text-center text-sm text-on-surface-variant">
          No shops found.
        </div>
      ) : null}
    </section>
  );
}