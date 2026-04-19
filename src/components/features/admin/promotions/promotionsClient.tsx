"use client";

import { useState } from "react";
import type { Promotion } from "@/src/types/interface";
import ConfirmDeleteModal from "@/src/components/ui/ConfirmDeleteModal";

import createPromotion from "@/src/lib/promotion/createPromotion";
import updatePromotion from "@/src/lib/promotion/updatePromotion";
import deletePromotion from "@/src/lib/promotion/deletePromotion";

interface PromotionsClientProps {
  initialPromotions: Promotion[];
  token: string;
}

export default function PromotionsClient({ initialPromotions, token }: PromotionsClientProps) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);     
  
  // NEW: Modern Error State instead of alert()
  const [formError, setFormError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<string | null>(null);

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
    setFormError(null); // Clear errors when opening modal
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
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null); // Clear previous errors

    const promoPayload = {
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

    try {
      if (editingPromo) {
        const updated = await updatePromotion(editingPromo._id, promoPayload, token);
        setPromotions((prev) => prev.map((p) => (p._id === editingPromo._id ? updated.data : p)));
      } else {
        const created = await createPromotion(promoPayload, token);
        setPromotions((prev) => [...prev, created.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save:", error);
      // Modern Error Handling
      setFormError(error instanceof Error ? error.message : "Failed to save promotion. Please check your data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setPromoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!promoToDelete) return;
    setIsSubmitting(true);
    try {
      await deletePromotion(promoToDelete, token);
      setPromotions((prev) => prev.filter((p) => p._id !== promoToDelete));
      setIsDeleteModalOpen(false);
      setPromoToDelete(null);
    } catch (error) {
      console.error("Failed to delete:", error);
      // We can also use formError for delete failures if we want, but usually standard UI handles it differently.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-8xl p-6 md:p-12">
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
                {promo.conditions?.enabled && (
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
                onClick={() => handleDeleteClick(promo._id)}
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

      {/* Promotion Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form 
            onSubmit={handleSave}
            className="w-full max-w-[800px] overflow-hidden rounded-[32px] bg-surface-container-lowest shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-10 py-8 border-b border-outline-variant/10 bg-white">
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
                  disabled={isSubmitting}
                  className="px-4 py-2 text-[15px] font-medium text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-primary px-8 py-3 text-[15px] font-medium tracking-wide text-on-primary shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingPromo ? "Update Promotion" : "Create Promotion"}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="bg-[#fbfcfa] p-10 overflow-y-auto flex-1">
              {/* MODERN ERROR BANNER */}
              {formError && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl bg-error-container/20 p-5 text-sm font-medium text-error border border-error/20 animate-in fade-in slide-in-from-top-2">
                   <img src="/badge-info.svg" className="w-5 mt-0.5 opacity-80 filter brightness-0 saturate-100 hue-rotate-[340deg]" alt="Error" />
                   <div className="flex-1">
                     <p className="font-bold mb-1">Could not save promotion</p>
                     <p className="font-light opacity-90">{formError}</p>
                   </div>
                </div>
              )}

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
                        min={1}
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
                        onChange={(e) => {
                            const newStart = e.target.value;
                            setFormData(prev => {
                                const isAfterEnd = prev.endDate && newStart >= prev.endDate;
                                return {
                                    ...prev, 
                                    startDate: newStart,
                                    endDate: isAfterEnd ? "" : prev.endDate 
                                };
                            });
                        }}
                        className="w-full rounded-[12px] bg-[#f4f6f4] px-5 py-4 text-[15px] text-on-surface outline-none focus:bg-[#ecf0ec] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-on-surface-variant">End Date</label>
                      <input
                        type="date"
                        required
                        min={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 86400000).toISOString().split('T')[0] : ""}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full rounded-[12px] bg-[#f4f6f4] px-5 py-4 text-[15px] text-on-surface outline-none focus:bg-[#ecf0ec] transition-colors disabled:opacity-50"
                        disabled={!formData.startDate}
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-outline-variant/10 pt-8">
                    <label className="mb-6 flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.conditionsEnabled}
                        onChange={(e) => {
                            const isEnabled = e.target.checked;
                            setFormData({ 
                                ...formData, 
                                conditionsEnabled: isEnabled,
                                minReservations: isEnabled && formData.minReservations === 0 ? 1 : formData.minReservations 
                            });
                        }}
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
                          min={1}
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

      {/* The Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={executeDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setPromoToDelete(null);
        }}
      />
    </section>
  );
}