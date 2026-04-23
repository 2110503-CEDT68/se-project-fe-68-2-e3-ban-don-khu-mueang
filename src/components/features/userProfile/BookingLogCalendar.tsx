"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getUserAvatarUrl } from "@/src/lib/avatar";

interface CalendarProps {
  bookingLogs: Record<string, any[]>;
  avatarUrl?: string | null;
  avatarSeed?: string;
}

export default function ProfileCalendarWidget({
  bookingLogs,
  avatarUrl,
  avatarSeed,
}: CalendarProps) {
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
  const today = new Date();
  setTodayStr(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
}, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const monthLabel = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });
  const avatarSrc = getUserAvatarUrl(avatarUrl, avatarSeed ?? "user");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200">
        <Image src={avatarSrc} alt="Avatar" className="rounded-full" fill />
      </div>

      <div className="w-75 shrink-0">
        <div className="mb-4 flex items-center justify-between font-bold">
          <button onClick={() => setViewDate(new Date(year, month - 1))} className="hover:text-primary transition-colors"><ChevronLeft size={20}/></button>
          <span>{monthLabel}</span>
          <button onClick={() => setViewDate(new Date(year, month + 1))} className="hover:text-primary transition-colors"><ChevronRight size={20}/></button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 mb-3">
          {['M','T','W','T','F','S','S'].map((d, i) => <span key={i}>{d}</span>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasBooking = bookingLogs[dateStr] && bookingLogs[dateStr].length > 0;
            
            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;

            let buttonClasses = "flex items-center justify-center aspect-square rounded-md text-xs transition-colors border-2 ";
            
            if (hasBooking) {
              if (isPast) {
                if (selectedDate === dateStr) {
                  buttonClasses += "bg-emerald-700 border-emerald-900 text-white font-bold cursor-pointer shadow-inner ";
                } else {
                  buttonClasses += "bg-emerald-600 border-transparent text-white font-bold cursor-pointer hover:bg-emerald-700 ";
                }
              } else if (isToday) {
                if (selectedDate === dateStr) {
                  buttonClasses += "bg-sky-700 border-sky-900 text-white font-bold cursor-pointer shadow-inner ";
                } else {
                  buttonClasses += "bg-sky-600 border-transparent text-white font-bold cursor-pointer hover:bg-sky-700 ";
                }
              } else {
                if (selectedDate === dateStr) {
                  buttonClasses += "bg-amber-700 border-amber-900 text-white font-bold cursor-pointer shadow-inner ";
                } else {
                  buttonClasses += "bg-amber-600 border-transparent text-white font-bold cursor-pointer hover:bg-amber-700 ";
                }
              }
            } else {
              if (isToday) {
                buttonClasses += "bg-slate-50 text-slate-600 font-bold border-slate-300 cursor-default ";
              } else if (isPast) {
                buttonClasses += "bg-slate-50 text-slate-300 border-slate-100 cursor-default ";
              } else {
                buttonClasses += "bg-slate-50 text-slate-400 border-slate-100 cursor-default ";
              }
            }

            return (
              <button
                key={dateStr}
                onClick={() => hasBooking && setSelectedDate(dateStr)}
                className={buttonClasses}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* HEIGHT-LOCKED CONTAINER: ALWAYS extends to 220px no matter what */}
        <div className="mt-6 h-55 w-full">
          {selectedDate && bookingLogs[selectedDate] ? (
            <div className="relative h-full overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 animate-in fade-in zoom-in-95 duration-200">
              <p className="sticky top-0 z-10 mb-2 bg-slate-50 py-1 text-[10px] font-bold uppercase text-slate-500">
                Booking Log: {selectedDate}
              </p>
              <div className="flex flex-col gap-2">
                {bookingLogs[selectedDate].map((log: any, idx: number) => (
                  // min-w-0 is CRITICAL here to allow the child text to truncate properly
                  <div 
                    key={log.id || idx} 
                    className="flex min-w-0 items-center justify-between border-b border-slate-200 pb-2 last:border-0 last:pb-0"
                  >
                    {/* flex-1 and min-w-0 force long text to turn into "..." instead of wrapping to a new line */}
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="truncate text-xs font-medium" title={log.shop}>
                        {log.shop}
                      </p>
                    </div>
                    
                    <div className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <span 
                        className={`whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[9px] ${
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
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
              <Clock size={24} className="mb-2 opacity-20" />
              <span className="text-xs font-medium">Select a colored date</span>
              <span className="text-[10px]">to view its booking log</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}