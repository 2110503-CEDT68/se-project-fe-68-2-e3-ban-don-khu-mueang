'use client';
import { useState } from 'react';
import EditReviewModal from '@/src/components/features/Review/EditReviewModal'; // เช็ค Path import ให้ตรงกับที่เก็บไฟล์ Modal ของคุณ

export default function TestModalPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">หน้าสำหรับทดสอบ Edit Modal (US 6-2)</h1>
      
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        เปิด Popup อีกครั้ง
      </button>

      {/* เอา ID จาก Compass มาใส่ใน reservationId นะครับ */}
      <EditReviewModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        reservationId="69a69944d68145f8ed78bea5" 
        initialRating={3} 
        initialComment="บริการดีมากครับ หมอนวดเก่ง" 
        token="ใส่_TOKEN_ของ_USER_ที่ล็อคอิน_มาเทสต์ชั่วคราว" 
        onSuccess={() => alert('อัปเดตข้อมูลลงฐานข้อมูลเรียบร้อย!')} 
      />
    </div>
  );
}
