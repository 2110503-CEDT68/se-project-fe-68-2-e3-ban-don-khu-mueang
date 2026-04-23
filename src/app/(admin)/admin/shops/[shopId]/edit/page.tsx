import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { AdminApiClient } from "@/src/lib/admin/adminApiClient";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import EditShopForm from "../../../../../../components/features/shops/editShopForm";

type ShopActionState = {
  success: boolean;
  message: string | null;
};

type EditShopPageProps = {
  params: Promise<{
    shopId: string;
  }>;
};

export default async function EditShopPage({ params }: EditShopPageProps) {
  const { shopId } = await params;
  const { session } = await requireAdminAuth();
  const token = session?.user?.token as string;

  const api = new AdminApiClient(token);

  const shopResponse = await api.getShopById(shopId).catch(() => null);

  if (!shopResponse?.data) {
    notFound();
  }

  async function updateShopAction(
    _prevState: ShopActionState,
    formData: FormData,
  ): Promise<ShopActionState> {
    "use server";

    try {
      const { session: actionSession } = await requireAdminAuth();
      const actionToken = actionSession?.user?.token as string;

      const actionApi = new AdminApiClient(actionToken);

      const pictures = formData
        .getAll("pictures")
        .map((value) => String(value).trim())
        .filter(Boolean);

      await actionApi.updateShop(shopId, {
        name: String(formData.get("name") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        district: String(formData.get("district") ?? "").trim(),
        province: String(formData.get("province") ?? "").trim(),
        postalcode: String(formData.get("postalcode") ?? "").trim(),
        tel: String(formData.get("tel") ?? "").trim(),
        price: Number(formData.get("price") ?? 0),
        pictures,
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to update shop. Please try again.";

      return {
        success: false,
        message,
      };
    }

    revalidatePath("/admin/shops");
    revalidatePath(`/admin/shops/${shopId}/edit`);
    redirect("/admin/shops");
  }

  async function deleteShopAction(
    _prevState: ShopActionState,
    _formData: FormData,
  ): Promise<ShopActionState> {
    "use server";
    void _prevState;
    void _formData;

    try {
      const { session: actionSession } = await requireAdminAuth();
      const actionToken = actionSession?.user?.token as string;

      const actionApi = new AdminApiClient(actionToken);

      await actionApi.deleteShop(shopId);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to delete shop. Please try again.";

      return {
        success: false,
        message,
      };
    }

    revalidatePath("/admin/shops");
    redirect("/admin/shops");
  }

  return (
    <EditShopForm
      shop={shopResponse.data}
      uploadToken={token}
      updateAction={updateShopAction}
      deleteAction={deleteShopAction}
    />
  );
}