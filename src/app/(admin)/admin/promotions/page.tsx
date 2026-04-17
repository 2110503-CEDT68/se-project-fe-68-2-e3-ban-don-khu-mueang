import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import PromotionsClient from "@/src/components/features/admin/promotions/promotionsClient";

export default async function AdminPromotionsPage() {
  await requireAdminAuth();

  return <PromotionsClient />;
}
