"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, Eye, Pencil, X, Loader2 } from "lucide-react";
import { getUserAvatarUrl } from "@/src/lib/avatar";
import { uploadAvatarImage } from "@/src/lib/upload/uploadClient";

interface CalendarProps {
  token: string; // 👈 Added token for API calls
  bookingLogs: Record<string, any[]>;
  avatarUrl?: string | null;
  avatarSeed?: string;
}

export default function ProfileCalendarWidget({
  token,
  bookingLogs,
  avatarUrl,
  avatarSeed,
}: CalendarProps) {
  const router = useRouter();
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [todayStr, setTodayStr] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize the avatar image URL
    setAvatarSrc(getUserAvatarUrl(avatarUrl, avatarSeed ?? "user"));

    // Set today's date string
    const today = new Date();
    setTodayStr(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
        today.getDate()
      ).padStart(2, "0")}`
    );
  }, [avatarUrl, avatarSeed]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const monthLabel = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optimistic UI update - show the image locally immediately
    const localUrl = URL.createObjectURL(file);
    setAvatarSrc(localUrl);

    setIsUploading(true);
    try {
      // Actually upload to the server
      const response = await uploadAvatarImage({ token, file });
      setAvatarSrc(response.data.avatarUrl);
      
      // 👈 Tell Next.js to refresh the session data in the background
      // This will instantly update the Navbar and other components across the site
      router.refresh(); 
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("Failed to upload image. Please try again.");
      // Revert back if it fails
      setAvatarSrc(getUserAvatarUrl(avatarUrl, avatarSeed ?? "user"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* ── Avatar ── */}
      <div className="relative group" style={{ width: 104, height: 104 }}>
        
        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-[2px]">
            <Loader2 className="h-6 w-6 animate-spin text-slate-800" />
          </div>
        )}

        {/* circle photo */}
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200">
          {avatarSrc && (
            <Image 
              src={avatarSrc} 
              alt="Avatar" 
              fill 
              unoptimized 
              className="object-cover" 
            />
          )}
        </div>

        {/* Hover overlay — Eye only (Hidden while uploading) */}
        {!isUploading && (
          <button
            onClick={() => setLightboxOpen(true)}
            title="View photo"
            className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 opacity-0 group-hover:opacity-100
                       transition-opacity duration-200 flex items-center justify-center text-white
                       hover:text-sky-300 cursor-pointer"
          >
            <Eye size={20} />
          </button>
        )}

        {/* Pencil badge — top-right (Hidden while uploading) */}
        {!isUploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Edit photo"
            className="absolute top-0 right-0 flex h-7 w-7 items-center justify-center
                       rounded-full bg-white border border-slate-200 shadow-md
                       text-slate-500 hover:text-amber-500 hover:border-amber-300
                       transition-colors z-10"
          >
            <Pencil size={13} />
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ width: 320, height: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-black/60 p-1 text-white
                         hover:bg-black/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── Calendar ── */}
      <div className="w-[300px] shrink-0">
        <div className="mb-4 flex items-center justify-between font-bold">
          <button
            onClick={() => setViewDate(new Date(year, month - 1))}
            className="hover:text-primary transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span>{monthLabel}</span>
          <button
            onClick={() => setViewDate(new Date(year, month + 1))}
            className="hover:text-primary transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 mb-3">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
              2,
              "0"
            )}`;
            const hasBooking = bookingLogs[dateStr]?.length > 0;
            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;

            let buttonClasses =
              "flex items-center justify-center aspect-square rounded-md text-xs transition-colors border-2 ";

            if (hasBooking) {
              if (isPast) {
                buttonClasses +=
                  selectedDate === dateStr
                    ? "bg-emerald-700 border-emerald-900 text-white font-bold cursor-pointer shadow-inner "
                    : "bg-emerald-600 border-transparent text-white font-bold cursor-pointer hover:bg-emerald-700 ";
              } else if (isToday) {
                buttonClasses +=
                  selectedDate === dateStr
                    ? "bg-sky-700 border-sky-900 text-white font-bold cursor-pointer shadow-inner "
                    : "bg-sky-600 border-transparent text-white font-bold cursor-pointer hover:bg-sky-700 ";
              } else {
                buttonClasses +=
                  selectedDate === dateStr
                    ? "bg-amber-700 border-amber-900 text-white font-bold cursor-pointer shadow-inner "
                    : "bg-amber-600 border-transparent text-white font-bold cursor-pointer hover:bg-amber-700 ";
              }
            } else {
              buttonClasses += isToday
                ? "bg-slate-50 text-slate-600 font-bold border-slate-300 cursor-default "
                : isPast
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-default "
                : "bg-slate-50 text-slate-400 border-slate-100 cursor-default ";
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

        {/* Booking log panel: HEIGHT-LOCKED CONTAINER */}
        <div className="mt-6 h-[220px] w-full">
          {selectedDate && bookingLogs[selectedDate] ? (
            <div className="relative h-full overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 animate-in fade-in zoom-in-95 duration-200">
              <p className="sticky top-0 z-10 mb-2 bg-slate-50 py-1 text-[10px] font-bold uppercase text-slate-500">
                Booking Log: {selectedDate}
              </p>
              <div className="flex flex-col gap-2">
                {bookingLogs[selectedDate].map((log: any, idx: number) => (
                  <div
                    key={log.id || idx}
                    className="flex min-w-0 items-center justify-between border-b border-slate-200 pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="truncate text-xs font-medium" title={log.shop}>
                        {log.shop}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <span
                        className={`whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[9px] ${
                          log.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {log.status}
                      </span>
                      <Clock size={10} className="shrink-0" />
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