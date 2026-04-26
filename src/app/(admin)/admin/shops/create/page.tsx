import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminApiClient } from "@/src/lib/admin/adminApiClient";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import CreateShopForm from "@/src/components/features/shops/createShopForm";
import { uploadMassageImage } from "@/src/lib/upload/uploadClient";

type CreateShopActionState = {
  success: boolean;
  message: string | null;
};

export default async function CreateShopPage() {
  const { session } = await requireAdminAuth();
  const token = session?.user?.token as string;

  async function createShopAction(
    _prevState: CreateShopActionState,
    formData: FormData,
  ): Promise<CreateShopActionState> {
    "use server";

    try {
      const { session: actionSession } = await requireAdminAuth();
      const actionToken = actionSession?.user?.token as string;

      const actionApi = new AdminApiClient(actionToken);

      const pictures = formData
        .getAll("pictures")
        .map((value) => String(value).trim())
        .filter(Boolean);

      const queuedFiles = formData
        .getAll("imageFiles")
        .filter((value): value is File => value instanceof File && value.size > 0);

      const createResponse = await actionApi.createShop({
        name: String(formData.get("name") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        district: String(formData.get("district") ?? "").trim(),
        province: String(formData.get("province") ?? "").trim(),
        postalcode: String(formData.get("postalcode") ?? "").trim(),
        tel: String(formData.get("tel") ?? "").trim(),
        price: Number(formData.get("price") ?? 0),
        pictures,
      });

      const createdShopId = createResponse.data?._id;

      if (createdShopId && queuedFiles.length > 0) {
        for (const file of queuedFiles) {
          await uploadMassageImage({
            token: actionToken,
            massageId: createdShopId,
            file,
          });
        }
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to create shop. Please try again.";

      return {
        success: false,
        message,
      };
    }

    revalidatePath("/admin/shops");
    redirect("/admin/shops");
  }

  return <CreateShopForm action={createShopAction} uploadToken={token} />;
}