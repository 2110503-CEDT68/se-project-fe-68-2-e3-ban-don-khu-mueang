import Image from "next/image"

interface Review {
  id: string
  userName: string
  userEmail: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: string
}

interface ReviewCardProps {
  review: Review
  onDelete: (reviewId: string) => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: "16px", color: i < rating ? "#F59E0B" : "#D1D5DB" }}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function ReviewCard({ review, onDelete }: ReviewCardProps) {
  return (
    <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E7EB", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "9999px", backgroundColor: "#D1D5DB", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Manrope, sans-serif", fontSize: "18px", fontWeight: 600, color: "#4E6053" }}>
          {review.userAvatar
            ? <Image src={`${review.userAvatar}`} width={48} height={48} alt={review.userName}/>
            : review.userName.charAt(0).toUpperCase()
          }
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1C18" }}>{review.userName}</p>
          <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6B7280" }}>{review.userEmail}</p>
        </div>
      </div>

      <StarRating rating={review.rating} />

      <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#374151", fontStyle: "italic" }}>
        "{review.comment}"
      </p>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => onDelete(review.id)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Manrope, sans-serif", fontSize: "12px", fontWeight: 600, color: "#B3261E", padding: "4px 8px", borderRadius: "6px", transition: "background 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FFDAD6" }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none" }}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  )
}