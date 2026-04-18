"use client"

import { useState } from "react"
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal"

interface EditPromotionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditPromotionModal({ isOpen, onClose }: EditPromotionModalProps) {
  const [promotionName, setPromotionName] = useState("Office Relief Express")
  const [description, setDescription] = useState(
    "Quick stress relief for busy professionals. Focus on neck, shoulders, and back to ease tension from long working hours."
  )
  const [hasCondition, setHasCondition] = useState(false)
  const [discount, setDiscount] = useState("5")
  const [minReservations, setMinReservations] = useState("10")
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  if (!isOpen) return null

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
        onClick={onClose}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: "700px",
            maxHeight: "90vh",
            overflowY: "auto",
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {/* Title */}
          {/* Title row + Close button */}
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
  <h2
    style={{
      margin: 0,
      fontFamily: '"Noto Serif", serif',
      fontSize: "24px",
      fontWeight: 400,
      lineHeight: "32px",
      color: "#1A1C18",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    <img src="/pencil-dark.svg" alt="edit" width={20} height={20} />
    Edit Promotion
      </h2>

      {/* X Close Button */}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
          padding: "4px 8px",
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

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>

            {/* Promotion Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: "Manrope, sans-serif", fontSize: "12px", fontWeight: 600, color: "#1A1C18" }}>
                Promotion Name
              </label>
              <input
                value={promotionName}
                onChange={e => setPromotionName(e.target.value)}
                placeholder="Office Relief Express"
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: "12px",
                  backgroundColor: "#F3F4ED",
                  border: "none",
                  outline: "none",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  color: "#1A1C18",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: "Manrope, sans-serif", fontSize: "12px", fontWeight: 600, color: "#1A1C18" }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: "12px",
                  backgroundColor: "#F3F4ED",
                  border: "none",
                  outline: "none",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  color: "#1A1C18",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Discount */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: "Manrope, sans-serif", fontSize: "12px", fontWeight: 600, color: "#1A1C18" }}>
                Discount
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  min={0}
                  max={100}
                  style={{
                    width: "80px",
                    padding: "15px 16px",
                    borderRadius: "12px",
                    backgroundColor: "#F3F4ED",
                    border: "none",
                    outline: "none",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "16px",
                    color: "#1A1C18",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1C18" }}>
                  %
                </span>
              </div>
            </div>

            {/* Condition Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ fontFamily: "Manrope, sans-serif", fontSize: "12px", fontWeight: 600, color: "#1A1C18" }}>
                Condition
              </label>
              <div
                onClick={() => setHasCondition(!hasCondition)}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "9999px",
                  backgroundColor: hasCondition ? "#4E6053" : "#C3C8C2",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: hasCondition ? "22px" : "2px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "9999px",
                    backgroundColor: "#FFFFFF",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>

            {/* Discount Condition */}
            {hasCondition && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#F3F4ED",
              }}>
                <label style={{ fontFamily: "Manrope, sans-serif", fontSize: "12px", fontWeight: 600, color: "#1A1C18" }}>
                  Discount Condition
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#4B5563" }}>
                    When user has a total reservation of more than
                  </span>
                  <input
                    type="number"
                    value={minReservations}
                    onChange={e => setMinReservations(e.target.value)}
                    min={1}
                    style={{
                      width: "70px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #C3C8C2",
                      outline: "none",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#1A1C18",
                      textAlign: "center",
                      boxSizing: "border-box",
                    }}
                  />
                  <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#4B5563" }}>
                    reservations
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", alignSelf: "flex-end" }}>

            {/* Save Changes */}
            <button
              style={{
                padding: "10px 24px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0)",
                border: "1px solid #4E6053",
                fontFamily: "Manrope, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#4E6053",
                cursor: "pointer",
                transition: "background 0.2s",
                boxShadow: "0 10px 15px -3px rgba(78,96,83,0.1)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4E6053"
                ;(e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0)"
                ;(e.currentTarget as HTMLButtonElement).style.color = "#4E6053"
              }}
            >
              Save Changes
            </button>

            {/* Cancel */}
            <button
              onClick={onClose}
              style={{
                padding: "10px 24px",
                borderRadius: "9999px",
                backgroundColor: "transparent",
                border: "none",
                fontFamily: "Manrope, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#4E6053",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E8E9E2"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"
              }}
            >
              Cancel
            </button>

            {/* Delete — เปิด ConfirmDeleteModal */}
            <button
              onClick={() => setIsConfirmDeleteOpen(true)}
              style={{
                padding: "10px 24px",
                borderRadius: "9999px",
                backgroundColor: "#FFDAD6",
                border: "none",
                fontFamily: "Manrope, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#93000A",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFB4AB"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFDAD6"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
              }}
              onMouseDown={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"
              }}
              onMouseUp={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onConfirm={() => {
          setIsConfirmDeleteOpen(false)
          onClose()
        }}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </>
  )
}