"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { uploadAvatarImage } from "@/src/lib/upload/uploadClient";
import { getUserAvatarUrl } from "@/src/lib/avatar";

// Add props interface
interface UserInfoProps {
  user: {
    id?: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  token: string;
  stats: {
    total: number;
    ended: number;
    inProgress: number;
  }
}

export default function UserInfo({ user, token, stats }: UserInfoProps) {
  const [showPass, setShowPass] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) {
      setUploadError("Please select an image first.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const response = await uploadAvatarImage({
        token,
        file,
      });

      setAvatarUrl(response.data.avatarUrl);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to upload avatar image.";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const avatarSrc = getUserAvatarUrl(
    avatarUrl,
    user.id ?? user.email ?? user.name ?? "user",
  );

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-slate-100 pb-2">
        <h2 className="text-xl font-bold text-slate-900">User Information</h2>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <div className="flex items-center gap-4">
          <img
            src={avatarSrc}
            alt={`${user.name} avatar`}
            className="h-20 w-20 rounded-full border border-slate-200 object-cover"
          />
          <div className="flex-1 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Profile Image
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png"
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                void handleAvatarUpload(file);
                event.currentTarget.value = "";
              }}
              className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700"
            />
            {isUploading ? <p className="text-xs text-slate-500">Uploading...</p> : null}
            {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
          </div>
        </div>
      </div>
      
      <div className="space-y-3 text-sm text-slate-700">
        <p><span className="font-bold text-slate-900 mr-2">Name:</span> {user.name}</p>
        <p><span className="font-bold text-slate-900 mr-2">Email:</span> {user.email}</p>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Password:</span>
          <span className="font-mono">{showPass ? "Protected by Auth" : "••••••••"}</span>
          <button onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-primary transition-colors focus:outline-none">
            {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        </div>
      </div>

      <div className="pt-4 space-y-2 text-sm border-t border-slate-100">
        <div className="flex justify-between items-center max-w-50">
          <span className="font-bold text-slate-900">Total Bookings:</span> 
          <span className="font-semibold">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center max-w-50 text-slate-500">
          <span>Already Ended:</span> 
          <span>{stats.ended}</span>
        </div>
        <div className="flex justify-between items-center max-w-50 text-primary font-medium">
          <span>In Progress:</span> 
          <span>{stats.inProgress}</span>
        </div>
      </div>
    </div>
  );
}