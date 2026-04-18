"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface CalendarProps {
  bookingLogs: Record<string, any[]>;
}

export default function ProfileCalendarWidget({ bookingLogs }: CalendarProps) {
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get current local date safely formatted as YYYY-MM-DD
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const monthLabel = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200">
        <Image src="https://api.dicebear.com/9.x/notionists/svg?seed=pawong" alt="Avatar" fill unoptimized />
      </div>

      <div className="w-full max-w-[300px]">
        <div className="mb-4 flex items-center justify-between font-bold">
          <button onClick={() => setViewDate(new Date(year, month - 1))}><ChevronLeft size={20}/></button>
          <span>{monthLabel}</span>
          <button onClick={() => setViewDate(new Date(year, month + 1))}><ChevronRight size={20}/></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
          {['M','T','W','T','F','S','S'].map((d, i) => <span key={i}>{d}</span>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasBooking = bookingLogs[dateStr] && bookingLogs[dateStr].length > 0;
            
            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;

            let buttonClasses = "aspect-square rounded-md text-xs transition-all ";
            
            if (hasBooking) {
              if (isPast) {
                // Past: Earth Tone Orange (Amber)
                buttonClasses += "bg-amber-500 text-white font-bold shadow-sm hover:opacity-90 cursor-pointer ";
              } else if (isToday) {
                // Today: Earth Tone Yellow
                buttonClasses += "bg-yellow-500 text-white font-bold shadow-md hover:opacity-90 cursor-pointer ";
              } else {
                // Future: Green (Emerald)
                buttonClasses += "bg-emerald-500 text-white font-bold shadow-sm hover:opacity-90 cursor-pointer ";
              }
            } else {
              if (isToday) {
                buttonClasses += "bg-slate-50 text-slate-600 font-bold border border-slate-300 cursor-default ";
              } else if (isPast) {
                buttonClasses += "bg-slate-50 text-slate-300 border border-slate-100 cursor-default ";
              } else {
                buttonClasses += "bg-slate-50 text-slate-400 border border-slate-100 cursor-default ";
              }
            }

            if (selectedDate === dateStr) {
              buttonClasses += "ring-2 ring-black ring-offset-1";
            }

            return (
              <button
                key={day}
                onClick={() => hasBooking && setSelectedDate(dateStr)}
                className={buttonClasses}
              >
                {day}
              </button>
            );
          })}
        </div>

        {selectedDate && bookingLogs[selectedDate] && (
          <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Booking Log: {selectedDate}</p>
            <div className="flex flex-col gap-2">
              {bookingLogs[selectedDate].map((log: any, idx: number) => (
                <div 
                  key={log.id || idx} 
                  className="flex justify-between items-center border-b border-slate-200 last:border-0 pb-2 last:pb-0"
                >
                  {/* Added truncate so long names don't push the right side out */}
                  <span className="text-xs font-medium truncate pr-2" title={log.shop}>
                    {log.shop}
                  </span>
                  
                  {/* Added shrink-0 to prevent the badge from compressing */}
                  <div className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-500">
                    <span 
                      className={`px-1.5 py-0.5 rounded-sm text-[9px] whitespace-nowrap ${
                        log.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {log.status}
                    </span>
                    <Clock size={10} className="shrink-0"/> 
                    <span className="whitespace-nowrap">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}