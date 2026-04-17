"use client";

import { useState } from "react";
import type { Promotion } from "@/src/types/interface";

const mockInitialPromotions: Promotion[] = [
  {
    _id: "mkmk-1111",
    name: "Songkran Special 20% Off",
    amount: 20,
    startDate: "2026-04-20T00:00:00.000Z",
    endDate: "2026-05-01T23:59:59.000Z",
    isActive: true,
    conditions: {
      enabled: true,
      minReservations: 3,
    },
  },
];

export default function PromotionsClient() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockInitialPromotions);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);     

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    conditionsEnabled: false,
    minReservations: 0,
  });

  const handleOpenModal = (promo?: Promotion) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        name: promo.name,
        amount: promo.amount,
        startDate: promo.startDate.split("T")[0],
        endDate: promo.endDate.split("T")[0],
        isActive: promo.isActive,
        conditionsEnabled: promo.conditions.enabled,
        minReservations: promo.conditions.minReservations,
      });
    } else {
      setEditingPromo(null);
      setFormData({
        name: "",
        amount: 0,
        startDate: "",
        endDate: "",
        isActive: true,
        conditionsEnabled: false,
        minReservations: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo: Promotion = {
      _id: editingPromo ? editingPromo._id : Math.random().toString(36).substring(7),
      name: formData.name,
      amount: formData.amount,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      isActive: formData.isActive,
      conditions: {
        enabled: formData.conditionsEnabled,
        minReservations: formData.minReservations,
      },
    };

    if (editingPromo) {
      setPromotions((prev) => prev.map((p) => (p._id === editingPromo._id ? newPromo : p)));
    } else {
      setPromotions((prev) => [...prev, newPromo]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      setPromotions((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <section className="mx-auto max-w-8xl p-6 md:p-12">
      {/* Header aligned exactly to standard ZenSpa Dashboard style */}
      <div className="mb-12 flex items-end justify-between">
        <div className="max-w-xl space-y-4">
          <h2 className="text-[40px] font-headline text-on-surface">Promotion Portfolio</h2>
          <p className="text-[15px] text-on-surface-variant font-light">Oversee your network of ethereal discounts. Manage details, pricing conditions, and operational status for every ZenSpa promotion.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium tracking-wide text-on-primary shadow-lg transition-all hover:bg-primary-container hover:text-on-primary-container"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">
            <img src="/circle-plus-dark.svg" alt="" className="invert group-hover:invert-0 w-5 h-5 transition-all" />
          </span>
          Create Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo) => (
          <div
            key={promo._id}
            className="flex flex-col justify-between overflow-hidden rounded-3xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
          >
            <div className="flex-1">
              <div className="mb-3 flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-[22px] font-headline text-primary">{promo.name}</h4>
                  <div className="text-[13px] font-medium text-on-surface-variant flex items-center gap-1.5 opacity-80">
                      <img src="/calendar-range.svg" className="w-3.5" alt="Date" />
                    {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="my-5 flex items-baseline gap-1">
                <span className="font-headline text-[32px] font-semibold text-tertiary">{promo.amount}%</span>
                <span className="text-[14px] font-medium text-on-surface-variant">/ discount</span>
              </div>
              <div className="mb-2 flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-surface-container px-3 py-1.5 text-xs font-medium text-on-surface">
                  <span className={`h-2 w-2 rounded-full ${promo.isActive ? "bg-primary" : "bg-error"}`}></span>
                  {promo.isActive ? "Active Now" : "Inactive"}
                </div>
                {promo.conditions.enabled && (
                  <div className="inline-flex items-center gap-2 self-start rounded-full bg-tertiary-container/30 px-3 py-1.5 text-xs font-medium text-tertiary">
                    <img src="/badge-info.svg" className="w-3.5 opacity-80" alt="Condition" />
                    Req. {promo.conditions.minReservations} reservations
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-outline-variant/10 pt-4">
              <button
                onClick={() => handleOpenModal(promo)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-container px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-highest"
              >
                <img src="/pencil.svg" className="w-4" alt="Edit" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(promo._id)}
                className="flex items-center justify-center rounded-xl bg-error-container/40 p-2.5 text-error transition-colors hover:bg-error-container"
              >
                <img src="/trash-2.svg" className="w-4" alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {promotions.length === 0 && (
        <div className="rounded-3xl bg-surface-container-lowest p-12 text-center text-on-surface-variant ring-1 ring-black/5">
          <p className="text-lg">No promotions found.</p>
        </div>
      )}

      {/* Promotion Modal aligned with Form UI style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form 
            onSubmit={handleSave}
            className="w-full max-w-200 overflow-hidden rounded-4xl bg-surface-container-lowest shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-10 py-8 border-b border-outline-variant/10">
              <div>
                <h3 className="text-4xl font-headline text-on-surface">
                  {editingPromo ? "Edit Promotion" : "Create Promotion"}
                </h3>
                <p className="mt-2 text-on-surface-variant font-light">Define the essence of your new physical sanctuary.</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-[15px] font-medium text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-8 py-3 text-[15px] font-medium tracking-wide text-on-primary shadow-sm transition-opacity hover:opacity-90"
                >
                  {editingPromo ? "Update Promotion" : "Create Promotion"}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="bg-[#fbfcfa] p-10 overflow-y-auto flex-1">
              <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5">
                <div className="mb-6 flex items-center gap-3">
                  <img src="/leaf.svg" className="w-5 opacity-70" alt="" />
                  <h4 className="text-2xl font-headline text-on-surface">Promotion Details</h4>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-on-surface-variant">Promotion Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-[12px] bg-[#f4f6f4] px-5 py-4 text-[15px] text-on-surface outline-none focus:bg-[#ecf0ec] transition-colors"
                      placeholder="e.g. The Morning Mist Retreat"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-on-surface-variant">Discount Amount (%)</label>
                      <input
                        type="number"
                        required
                        min={0}
                        max={100}
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        placeholder="e.g. 20"
                        className="w-full rounded-[12px] bg-[#f4f6f4] px-5 py-4 text-[15px] text-on-surface outline-none focus:bg-[#ecf0ec] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-on-surface-variant">Status</label>
                      <div className="flex h-14 items-center rounded-[12px] bg-[#f4f6f4] px-5 transition-colors hover:bg-[#ecf0ec]">
                        <label className="flex w-full cursor-pointer items-center justify-between">
                          <span className="text-[15px] text-on-surface">Active Promotion</span>
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-on-surface-variant">Start Date</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full rounded-[12px] bg-[#f4f6f4] px-5 py-4 text-[15px] text-on-surface outline-none focus:bg-[#ecf0ec] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-on-surface-variant">End Date</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full rounded-[12px] bg-[#f4f6f4] px-5 py-4 text-[15px] text-on-surface outline-none focus:bg-[#ecf0ec] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-outline-variant/10 pt-8">
                    <label className="mb-6 flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.conditionsEnabled}
                        onChange={(e) => setFormData({ ...formData, conditionsEnabled: e.target.checked })}
                        className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-[15px] font-semibold text-on-surface">Enable Minimum Reservation Condition</span>
                    </label>

                    {formData.conditionsEnabled && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="mb-2 block text-[13px] font-semibold text-on-surface-variant">
                          Required Reservations
                        </label>
                        <input
                          type="number"
                          required={formData.conditionsEnabled}
                          min={0}
                          value={formData.minReservations}
                          onChange={(e) => setFormData({ ...formData, minReservations: Number(e.target.value) })}
                          placeholder="e.g. 3"
                          className="w-full md:w-1/2 rounded-[12px] bg-[#f4f6f4] px-5 py-4 text-[15px] text-on-surface outline-none focus:bg-[#ecf0ec] transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
