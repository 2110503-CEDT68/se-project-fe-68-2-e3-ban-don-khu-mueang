'use client';
import { useState, useEffect } from 'react';

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  initialRating: number;
  initialComment: string;
  token: string;
  onSuccess: () => void;
}

export default function EditReviewModal({ isOpen, onClose, reservationId, initialRating, initialComment, token, onSuccess }: EditReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRating(initialRating);
    setComment(initialComment);
  }, [isOpen, initialRating, initialComment]);

  if (!isOpen) return null;

  // ฟังก์ชันสำหรับการบันทึก (แก้ไข)
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservations/${reservationId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        alert("ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (error) {
      console.error("Error updating review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ฟังก์ชันสำหรับการลบ (เพิ่มใหม่)
  const handleDelete = async () => {
    // มี Popup Confirm ของเบราว์เซอร์กันเหนียวให้ก่อน 1 ชั้น
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้?")) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservations/${reservationId}/review`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        alert("ไม่สามารถลบข้อมูลได้");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">แก้ไขรีวิวของคุณ</h2>

        {/* ส่วนเลือกดาว */}
        <div className="flex justify-center space-x-3 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl transition-all hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              ★
            </button>
          ))}
        </div>

        {/* ส่วนพิมพ์คอมเมนต์ */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">ความคิดเห็นของคุณ</label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ประทับใจแค่ไหน บอกเราได้ที่นี่..."
          />
        </div>

        {/* แถบปุ่มกดยืนยัน/ยกเลิก/ลบ */}
        <div className="flex justify-between items-center mt-2">
          {/* ปุ่มลบ (อยู่ซ้ายสุด) */}
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-red-500 font-semibold hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            ลบรีวิว
          </button>

          {/* ปุ่มยกเลิก และ บันทึก (อยู่ขวาสุด) */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}