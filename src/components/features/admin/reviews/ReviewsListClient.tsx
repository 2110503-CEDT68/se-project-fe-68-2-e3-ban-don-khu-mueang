"use client"

import { useState } from "react"
import ReviewCard from "./ReviewCard"
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal"

interface Review {
  id: string
  userName: string
  userEmail: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: string
}

interface ReviewsListClientProps {
  reviews: Review[]
  totalCount: number
  hasNextPage: boolean
  deleteReviewAction: (formData: FormData) => Promise<void>
}

export default function ReviewsListClient({
  reviews,
  totalCount,
  hasNextPage,
  deleteReviewAction,
}: ReviewsListClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)

  function handleDeleteClick(reviewId: string) {
    setSelectedReviewId(reviewId)
    setIsModalOpen(true)
  }

  function handleCancel() {
    setIsModalOpen(false)
    setSelectedReviewId(null)
  }

  async function handleConfirm() {
    if (!selectedReviewId) return
    const formData = new FormData()
    formData.append("reviewId", selectedReviewId)
    await deleteReviewAction(formData)
    setIsModalOpen(false)
    setSelectedReviewId(null)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", padding: "32px", gap: "48px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h1 style={{ margin: 0, fontFamily: '"Noto Serif", serif', fontSize: "36px", fontWeight: 400, lineHeight: "40px", color: "#1A1C18" }}>
          All Reviews
        </h1>
        <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "16px", lineHeight: "26px", color: "#4B5563", maxWidth: "541px" }}>
          Monitor and moderate customer feedback across all ZenSpa locations.
        Remove inappropriate reviews to maintain the quality of the sanctuary experience.
        </p>
      </div>

      {/* Grid */}
      {reviews.length === 0 ? (
        <p style={{ fontFamily: "Manrope, sans-serif", color: "#6B7280" }}>No reviews found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", width: "100%" }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      {/* Modal — ใช้ props ตรงๆ ที่ ConfirmDeleteModal รับ */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}