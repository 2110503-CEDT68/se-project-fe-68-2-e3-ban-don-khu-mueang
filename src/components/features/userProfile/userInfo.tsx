"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Add props interface
interface UserInfoProps {
  user: {
    name: string;
    email: string;
  };
  stats: {
    total: number;
    ended: number;
    inProgress: number;
  }
}

export default function UserInfo({ user, stats }: UserInfoProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-slate-100 pb-2">
        <h2 className="text-xl font-bold text-slate-900">User Information</h2>
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
        <div className="flex justify-between items-center max-w-[200px]">
          <span className="font-bold text-slate-900">Total Bookings:</span> 
          <span className="font-semibold">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center max-w-[200px] text-slate-500">
          <span>Already Ended:</span> 
          <span>{stats.ended}</span>
        </div>
        <div className="flex justify-between items-center max-w-[200px] text-primary font-medium">
          <span>In Progress:</span> 
          <span>{stats.inProgress}</span>
        </div>
      </div>
    </div>
  );
}