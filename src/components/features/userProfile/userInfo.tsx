"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Pencil,
  Phone,
  Mail,
  User,
  X,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

interface UserInfoProps {
  user: {
    name: string;
    email: string;
    telephone?: string;
  };
  stats: {
    total: number;
    ended: number;
    inProgress: number;
  };
}

// ─── tiny reusable locked field ────────────────────────────────────────────
function LockedField({
  icon,
  label,
  value,
  originalValue,
  locked,
  onUnlock,
  onCancel,
  onChange,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  originalValue: string;
  locked: boolean;
  onUnlock: () => void;
  onCancel: () => void;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <span className="text-slate-400">{icon}</span>
        <input
          type={type}
          value={value}
          readOnly={locked}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 bg-transparent text-sm outline-none transition-colors ${
            locked ? "cursor-default text-slate-600" : "text-slate-900"
          }`}
        />
        {locked ? (
          <button
            onClick={onUnlock}
            className="text-slate-300 hover:text-amber-500 transition-colors"
            title="Click to edit"
          >
            <Pencil size={14} />
          </button>
        ) : (
          <button
            onClick={() => { onChange(originalValue); onCancel(); }}
            className="text-amber-400 hover:text-red-400 transition-colors"
            title="Cancel edit"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── password input ─────────────────────────────────────────────────────────
function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <Lock size={14} className="text-slate-400 shrink-0" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••"}
          className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-300"
        />
        <button
          onClick={() => setShow(!show)}
          className="text-slate-300 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── confirm-password modal ──────────────────────────────────────────────────
function ConfirmPasswordModal({
  title,
  onConfirm,
  onClose,
}: {
  title: string;
  onConfirm: (pw: string) => void;
  onClose: () => void;
}) {
  const [pw, setPw] = useState("");
  return (
    <ModalShell title={title} onClose={onClose}>
      <p className="text-sm text-slate-500 mb-4">
        Please enter your <span className="font-semibold text-slate-700">current password</span> to
        confirm this change.
      </p>
      <PasswordInput label="Current password" value={pw} onChange={setPw} />
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(pw)}
          disabled={!pw}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-40 transition-colors"
        >
          Confirm &amp; Save
        </button>
      </div>
    </ModalShell>
  );
}

// ─── modal shell ────────────────────────────────────────────────────────────
function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────
export default function UserInfo({ user, stats }: UserInfoProps) {
  // live user data
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [telephone, setTelephone] = useState(user.telephone ?? "");

  // modal state
  type Modal = "editInfo" | "confirmInfo" | "editPassword" | null;
  const [modal, setModal] = useState<Modal>(null);

  // edit-info draft
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftTel, setDraftTel] = useState(telephone);
  const [lockedName, setLockedName] = useState(true);
  const [lockedEmail, setLockedEmail] = useState(true);
  const [lockedTel, setLockedTel] = useState(true);

  // edit-password draft
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");

  // toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openEditInfo = () => {
    setDraftName(name);
    setDraftEmail(email);
    setDraftTel(telephone);
    setLockedName(true);
    setLockedEmail(true);
    setLockedTel(true);
    setModal("editInfo");
  };

  const openEditPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwError("");
    setModal("editPassword");
  };

  const handleInfoSaveClick = () => {
    setModal("confirmInfo");
  };

  const handleInfoConfirm = (_pw: string) => {
    // In production, verify _pw server-side before applying
    setName(draftName);
    setEmail(draftEmail);
    setTelephone(draftTel);
    setModal(null);
    showToast("Personal info updated successfully.");
  };

  const handlePasswordSaveClick = () => {
    if (!currentPassword) { setPwError("Please enter your current password."); return; }
    if (!newPassword) { setPwError("Please enter a new password."); return; }
    if (newPassword !== confirmPassword) { setPwError("Passwords do not match."); return; }
    setPwError("");
    // In production, call your auth API with currentPassword + newPassword here
    setModal(null);
    showToast("Password changed successfully.");
  };

  return (
    <div className="space-y-6 relative">
      {/* header */}
      <div className="border-b-2 border-slate-100 pb-2">
        <h2 className="text-xl font-bold text-slate-900">User Information</h2>
      </div>

      {/* info rows */}
      <div className="space-y-3 text-sm text-slate-700">
        <p>
          <span className="font-bold text-slate-900 mr-2">Name:</span> {name}
        </p>
        <p>
          <span className="font-bold text-slate-900 mr-2">Email:</span> {email}
        </p>
        <p>
          <span className="font-bold text-slate-900 mr-2">Telephone:</span>{" "}
          {telephone || <span className="text-slate-400 italic">not set</span>}
        </p>
      </div>

      {/* action buttons */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={openEditInfo}
          className="flex-1 rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white
                     hover:bg-slate-700 transition-all shadow-sm"
        >
          Edit Personal Info
        </button>
        <button
          onClick={openEditPassword}
          className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700
                     hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          Edit Password
        </button>
      </div>

      {/* stats */}
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

      {/* ── MODALS ── */}

      {/* Edit Personal Info */}
      {modal === "editInfo" && (
        <ModalShell title="Edit Personal Info" onClose={() => setModal(null)}>
          <p className="text-xs text-slate-400 mb-4">
            Click the <Pencil size={11} className="inline mb-0.5" /> icon next to a field to enable
            editing.
          </p>
          <div className="space-y-3">
            <LockedField
              icon={<User size={14} />}
              label="Name"
              value={draftName}
              originalValue={name}
              locked={lockedName}
              onUnlock={() => setLockedName(false)}
              onCancel={() => setLockedName(true)}
              onChange={setDraftName}
            />
            <LockedField
              icon={<Mail size={14} />}
              label="Email"
              value={draftEmail}
              originalValue={email}
              locked={lockedEmail}
              onUnlock={() => setLockedEmail(false)}
              onCancel={() => setLockedEmail(true)}
              onChange={setDraftEmail}
              type="email"
            />
            <LockedField
              icon={<Phone size={14} />}
              label="Telephone"
              value={draftTel}
              originalValue={telephone}
              locked={lockedTel}
              onUnlock={() => setLockedTel(false)}
              onCancel={() => setLockedTel(true)}
              onChange={setDraftTel}
              type="tel"
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setModal(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInfoSaveClick}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </ModalShell>
      )}

      {/* Confirm Personal Info */}
      {modal === "confirmInfo" && (
        <ConfirmPasswordModal
          title="Confirm Your Identity"
          onConfirm={handleInfoConfirm}
          onClose={() => setModal("editInfo")}
        />
      )}

      {modal === "editPassword" && (
        <ModalShell title="Edit Password" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Enter current password"
            />
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Enter new password"
              />
              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Repeat new password"
              />
            </div>
            {pwError && <p className="text-xs text-red-500">{pwError}</p>}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setModal(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSaveClick}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors"
            >
              Save Password
            </button>
          </div>
        </ModalShell>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2
                        rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl
                        animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}