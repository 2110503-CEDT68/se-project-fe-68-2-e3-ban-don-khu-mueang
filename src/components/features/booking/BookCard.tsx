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
import { toBangkokOffsetDateTime } from '@/src/lib/dateTime';

interface BookCardProps {
    id?: string;
    token?: string;
    reserveDate?: string;
    title?: string;
    imageSrc?: string;
    date?: string;
    time?: string;
    province?: string;
    tel?: string;
    price?: number;
    netPrice?: number;
    discount?: { name: string; amount: number }[];
    createdAt?: string;
}

export default function BookCard({
    id,
    token,
    reserveDate,
    title = "Default Massages",
    imageSrc = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop",
    date = "Oct 24, 2024",
    time = "10:00 AM - 11:30 AM",
    province,
    tel,
    price,
    netPrice,
    discount = [],
    createdAt
}: BookCardProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Parse the initial date if provided to HTML input format yyyy-MM-dd and HH:mm
    const dateObj = reserveDate ? new Date(reserveDate) : new Date();
    const initDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const initTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    const [editDate, setEditDate] = useState(initDate);
    const [editTime, setEditTime] = useState(initTime);
    const formattedCreatedAt = createdAt
        ? new Date(createdAt).toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : null;

    const hasExtraDetails =
        typeof price === 'number' ||
        typeof netPrice === 'number' ||
        discount.length > 0 ||
        Boolean(province) ||
        Boolean(tel) ||
        Boolean(createdAt);

    const formatBaht = (amount: number) => `฿${amount.toFixed(2)}`;
    const stopToggle = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };

    const handleCardKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsExpanded((prev) => !prev);
        }
    };

    const handleSave = async () => {
        if (!id || !token) return;
        setIsSubmitting(true);
        const bangkokReserveDate = toBangkokOffsetDateTime(`${editDate}T${editTime}:00`);

        try {
            await updateReservation(id, bangkokReserveDate, token);
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
        <div
            className="flex flex-col p-8 bg-surface-container-lowest border border-outline/20 rounded-xl w-full gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    onKeyDown={handleCardKeyDown}
                    className="flex items-start gap-6 text-left"
                >
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-surface-dim shadow-none">
                        <Image src={imageSrc} alt={title} width={96} height={96} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="font-headline text-2xl leading-tight text-primary break-words whitespace-normal min-h-[3.75rem] max-w-[18rem] md:max-w-[24rem]">
                            {title}
                        </h3>

                        {isEditing ? (
                            <div className="flex flex-col sm:flex-row gap-3 mt-1">
                                <input
                                    type="date"
                                    aria-label="Edit reservation date"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    onClick={stopToggle}
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 border border-outline rounded-md text-sm text-foreground bg-surface focus:outline-primary"
                                />
                                <input
                                    type="time"
                                    aria-label="Edit reservation time"
                                    value={editTime}
                                    onChange={(e) => setEditTime(e.target.value)}
                                    onClick={stopToggle}
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

                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
                            {isExpanded ? 'Hide details' : 'Tap to view details'}
                        </p>
                    </div>
                </button>

                <div onClick={stopToggle} className="flex flex-col gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
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
                            onClick={(event) => {
                                stopToggle(event);
                                if (id) setIsEditing(true);
                            }}
                            disabled={!id || isSubmitting}
                            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-surface-container-high rounded-full hover:bg-[#dfe1d9] active:scale-95 transition-all w-full sm:w-auto disabled:opacity-50"
                        >
                            <EditIcon className='text-[18px] text-foreground' />
                            <span className="font-semibold text-sm text-foreground">Edit</span>
                        </button>
                        <button
                            onClick={(event) => {
                                stopToggle(event);
                                void handleCancel();
                            }}
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

            {isExpanded && (
                <div className="rounded-xl border border-outline/15 bg-surface px-5 py-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                        Booking details
                    </h4>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-lg bg-surface-container-low px-4 py-3">
                            <p className="text-xs uppercase tracking-wider text-on-surface-variant">Date</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{date}</p>
                        </div>
                        <div className="rounded-lg bg-surface-container-low px-4 py-3">
                            <p className="text-xs uppercase tracking-wider text-on-surface-variant">Time</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{time}</p>
                        </div>
                        {typeof price === 'number' && (
                            <div className="rounded-lg bg-surface-container-low px-4 py-3">
                                <p className="text-xs uppercase tracking-wider text-on-surface-variant">Subtotal</p>
                                <p className="mt-1 text-sm font-semibold text-foreground">{formatBaht(price)}</p>
                            </div>
                        )}
                        {typeof netPrice === 'number' && (
                            <div className="rounded-lg bg-surface-container-low px-4 py-3">
                                <p className="text-xs uppercase tracking-wider text-on-surface-variant">Total paid</p>
                                <p className="mt-1 text-sm font-semibold text-foreground">{formatBaht(netPrice)}</p>
                            </div>
                        )}
                        {province && (
                            <div className="rounded-lg bg-surface-container-low px-4 py-3">
                                <p className="text-xs uppercase tracking-wider text-on-surface-variant">Province</p>
                                <p className="mt-1 text-sm font-semibold text-foreground">{province}</p>
                            </div>
                        )}
                        {tel && (
                            <div className="rounded-lg bg-surface-container-low px-4 py-3">
                                <p className="text-xs uppercase tracking-wider text-on-surface-variant">Shop phone</p>
                                <p className="mt-1 text-sm font-semibold text-foreground">{tel}</p>
                            </div>
                        )}
                    </div>

                    {discount.length > 0 && (
                        <div className="mt-3 rounded-lg bg-primary-container/40 px-4 py-3">
                            <p className="text-xs uppercase tracking-wider text-on-surface-variant">Applied discounts</p>
                            <ul className="mt-2 space-y-1">
                                {discount.map((item, index) => (
                                    <li
                                        key={`${item.name}-${index}`}
                                        className="flex items-center justify-between text-sm text-foreground"
                                    >
                                        <span>{item.name}</span>
                                        <span className="font-semibold">-{formatBaht(item.amount)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {formattedCreatedAt && (
                        <p className="mt-3 text-xs text-on-surface-variant">
                            Booking Date: {formattedCreatedAt}
                        </p>
                    )}

                    {!hasExtraDetails && (
                        <p className="mt-3 text-sm text-on-surface-variant">
                            More details will appear here after your booking data is fully loaded.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}