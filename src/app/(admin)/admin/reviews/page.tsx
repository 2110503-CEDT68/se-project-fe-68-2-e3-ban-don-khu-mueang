import { revalidatePath } from "next/cache";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import getSessionAuthContext from "@/src/lib/auth/getSessionAuthContext";
import getAllReviews from "@/src/lib/review/getAllReviews"; // We will create this below
import deleteReview from "@/src/lib/review/deleteReview"; // The delete function we made earlier
import ReviewsListClient from "@/src/components/features/admin/reviews/ReviewsListClient";

export default async function ManageReviewsPage() {
  await requireAdminAuth();
  
  // 1. Get the admin's token
  const { session } = await getSessionAuthContext();
  const token = session?.user?.token; 

  if (!token) {
    return <div>Unauthorized: No token found.</div>;
  }

  // 2. Fetch real data from your backend
  let rawReviews = [];
  try {
    const response = await getAllReviews(token);
    rawReviews = response.data || [];
    console.log("Fetched reviews:", rawReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }

  // 3. Format the backend data to match what ReviewsListClient expects
  const formattedReviews = rawReviews.map((review: any) => ({
    id: review._id,
    userName: review.user?.name || "Unknown User",
    userEmail: review.user?.email || "No email",
    userAvatar: review.user?._id || "default", // Using user ID so dicebear avatar works
    rating: review.rating,
    comment: review.comment || "No comment provided.",
    // Formats ISO string (e.g. "2024-01-01T00:00:00.000Z") to "2024-01-01"
    createdAt: review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : "N/A", 
  }));

  // 4. Real Server Action for deletion
  async function deleteReviewAction(formData: FormData) {
    "use server";
    
    // Assuming your Client Component form passes a hidden input named "reviewId"
    const reviewId = formData.get("reviewId") as string;

    if (!reviewId || !token) return;

    try {
      await deleteReview(reviewId, token); // Calls your backend DELETE route
      revalidatePath("/admin/reviews"); // Refreshes the page data instantly
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  }

  return (
    <ReviewsListClient
      reviews={formattedReviews}
      totalCount={formattedReviews.length}
      hasNextPage={false} // Update this later if you implement backend pagination
      deleteReviewAction={deleteReviewAction}
    />
  );
}