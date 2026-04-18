import * as React from "react"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDeleteModal = React.forwardRef<HTMLDivElement, ConfirmDeleteModalProps>(
  ({ isOpen, onConfirm, onCancel }, ref) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
        <div
          ref={ref}
          style={{
            width: "383px",
            padding: "19px 32px 32px 32px",
            borderRadius: "12px",
            border: "1px solid rgba(195, 200, 255, 0.3)",
            backgroundColor: "#FFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Close Button Row */}
          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <button
              onClick={onCancel}
              aria-label="Close"
              className="group"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: "4px 6px",
                color: "#4E6053",
                borderRadius: "6px",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#F0F0EC"
                ;(e.currentTarget as HTMLButtonElement).style.color = "#B3261E"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "none"
                ;(e.currentTarget as HTMLButtonElement).style.color = "#4E6053"
              }}
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <p
            style={{
              color: "#4E6053",
              textAlign: "center",
              fontFamily: '"Noto Serif", serif',
              fontSize: "24px",
              fontWeight: 400,
              lineHeight: "32px",
              margin: 0,
            }}
          >
            Are you sure?
          </p>

          {/* Body Text */}
          <p
            style={{
              color: "#4E6053",
              textAlign: "center",
              fontFamily: "Manrope, sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "16px",
              letterSpacing: "-0.6px",
              margin: 0,
            }}
          >
            Do you really want to delete the promotion?
            <br />
            This action cannot be done.
          </p>

          {/* Buttons Row */}
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>

            {/* Confirm Button */}
            <button
              onClick={onConfirm}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "140px",
                padding: "12px 24px",
                borderRadius: "9999px",
                background: "#E8E9E2",
                border: "none",
                cursor: "pointer",
                fontFamily: "Manrope, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#4E6053",
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#D6D8D0"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#E8E9E2"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
              }}
              onMouseDown={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"
              }}
              onMouseUp={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"
              }}
            >
              🗑 Confirm
            </button>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "140px",
                padding: "12px 24px",
                borderRadius: "9999px",
                background: "#FFDAD6",
                border: "none",
                cursor: "pointer",
                fontFamily: "Manrope, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#B3261E",
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#FFB4AB"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#FFDAD6"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
              }}
              onMouseDown={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"
              }}
              onMouseUp={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"
              }}
            >
              ✕ Cancel
            </button>

          </div>
        </div>
      </div>
    )
  }
)

ConfirmDeleteModal.displayName = "ConfirmDeleteModal"

export default ConfirmDeleteModal