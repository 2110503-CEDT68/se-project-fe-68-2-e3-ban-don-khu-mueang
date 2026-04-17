import { revalidatePath } from "next/cache";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import ReviewsListClient from "@/src/components/features/admin/reviews/ReviewsListClient";

const mockReviews = [
  {
    id: "1",
    userName: "Julianne Moore",
    userEmail: "julianne.m@sanctuary.com",
    userAvatar: "",
    rating: 5,
    comment: "Absolutely transformative experience.",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    userName: "Seraphina Rose",
    userEmail: "s.rose@icloud.com",
    userAvatar: "",
    rating: 3,
    comment: "Not bad.",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    userName: "Leo Sterling",
    userEmail: "sterling.l@outlook.com",
    userAvatar: "",
    rating: 4,
    comment: "Nice service!",
    createdAt: "2024-01-03",
  },
]

export default async function ManageReviewsPage() {
  await requireAdminAuth();

  async function deleteReviewAction(formData: FormData) {
    "use server";
    // TODO: เชื่อม API จริงทีหลัง
    revalidatePath("/admin/reviews");
  }

  return (
    <ReviewsListClient
      reviews={mockReviews}
      totalCount={mockReviews.length}
      hasNextPage={false}
      deleteReviewAction={deleteReviewAction}
    />
  );
}