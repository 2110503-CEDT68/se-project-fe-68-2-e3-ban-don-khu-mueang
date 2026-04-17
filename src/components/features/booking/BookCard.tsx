"use client";
import { useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from 'next/navigation';
import updateReservation from '../../../lib/reservation/updateReservation';
import deleteReservation from '../../../lib/reservation/deleteReservation';
import Image from 'next/image';

interface BookCardProps {
    id?: string;
    token?: string;
    reserveDate?: string;
    title?: string;
    imageSrc?: string;
    date?: string;
    time?: string;
}

export default function BookCard({
    id,
    token,
    reserveDate,
    title = "Default Massages",
    imageSrc = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop",
    date = "Oct 24, 2024",
    time = "10:00 AM - 11:30 AM"
}: BookCardProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Parse the initial date if provided to HTML input format yyyy-MM-dd and HH:mm
    const dateObj = reserveDate ? new Date(reserveDate) : new Date();
    const initDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const initTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    const [editDate, setEditDate] = useState(initDate);
    const [editTime, setEditTime] = useState(initTime);

    const handleSave = async () => {
        if (!id || !token) return;
        setIsSubmitting(true);
        // Combine date and time
        const newReserveDate = new Date(`${editDate}T${editTime}:00`);

        try {
            await updateReservation(id, newReserveDate.toISOString(), token);
            setIsEditing(false);
            router.refresh();
        } catch (err) {
            console.error("Failed to update reservation", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!id || !token) return;
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

        setIsSubmitting(true);
        try {
            await deleteReservation(id, token);
            router.refresh();
        } catch (err) {
            console.error("Failed to cancel reservation", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 bg-surface-container-lowest border border-outline/20 rounded-xl w-full gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-6">
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-surface-dim shadow-none">
                    <Image src={imageSrc} alt={title} width={96} height={96} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-headline text-2xl text-primary">{title}</h3>

                    {isEditing ? (
                        <div className="flex flex-col sm:flex-row gap-3 mt-1">
                            <input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                disabled={isSubmitting}
                                className="px-3 py-1.5 border border-outline rounded-md text-sm text-foreground bg-surface focus:outline-primary"
                            />
                            <input
                                type="time"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                                disabled={isSubmitting}
                                className="px-3 py-1.5 border border-outline rounded-md text-sm text-foreground bg-surface focus:outline-primary"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 opacity-80">
                                <CalendarTodayIcon className="text-[18px] text-on-surface-variant shrink-0" />
                                <span className="text-sm font-medium text-on-surface-variant">{date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-80">
                                <ScheduleIcon className="text-[18px] text-on-surface-variant shrink-0" />
                                <span className="text-sm font-medium text-on-surface-variant">{time}</span>
                            </div>
                        </div>
                    )}

                    <div className="mt-2 text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        Confirmed
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-primary text-on-primary rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all w-full sm:w-auto disabled:opacity-50"
                        >
                            <SaveIcon className='text-[18px]' />
                            <span className="font-semibold text-sm">Save</span>
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-surface-container-high rounded-full hover:bg-[#dfe1d9] transition-all w-full sm:w-auto disabled:opacity-50"
                        >
                            <CancelIcon className='text-[18px] text-on-surface-variant' />
                            <span className="font-semibold text-sm text-on-surface-variant">Cancel Edit</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => id && setIsEditing(true)}
                            disabled={!id || isSubmitting}
                            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-surface-container-high rounded-full hover:bg-[#dfe1d9] active:scale-95 transition-all w-full sm:w-auto disabled:opacity-50"
                        >
                            <EditIcon className='text-[18px] text-foreground' />
                            <span className="font-semibold text-sm text-foreground">Edit</span>
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={!id || isSubmitting}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-error-container rounded-full hover:bg-[#ffd1cc] active:scale-95 transition-all w-full sm:w-auto disabled:opacity-50"
                        >
                            <DeleteIcon className='text-[18px] text-on-error-container' />
                            <span className="font-semibold text-sm text-on-error-container">Cancel</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}