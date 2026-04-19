import PromotionsClient from "@/src/components/features/admin/promotions/promotionsClient";
import getPromotions from "@/src/lib/promotion/getPromotions";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth"; 

export const dynamic = 'force-dynamic';

export default async function AdminPromotionsPage() {
    await requireAdminAuth();

    const { session } = await getSessionAuthContext();
    const token = session?.user?.token;
    
    let promotionsData = [];
    try {
        // FIX: Pass the token into the getPromotions function here!
        const response = await getPromotions(token || "");
        promotionsData = response.data || [];
    } catch (error) {
        console.error("Error fetching promotions:", error);
    }

    return (
        <PromotionsClient 
            initialPromotions={promotionsData} 
            token={token || ""} 
        />
    );
}