export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export interface MassageShop {
    _id: string;
    id: string;
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    pictures: string[];
    price: number;
    averageRating: number;
    userRatingCount: number;
}

export interface BookingItem {
    _id: string;
    reserveDate: string;
    user: UserProfile;
    massage: MassageShop;
    isRated: boolean;
    createdAt: string;
    rating?: number;
    __v?: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    count: number;
    totalCount: number;
    pagination?: {
        next?: { page: number; limit: number };
        prev?: { page: number; limit: number };
    };
    data: T[];
}

export type MassagesResponse = PaginatedResponse<MassageShop>;

export interface Promotion {
    _id: string;
    name: string;
    amount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    conditions: {
        enabled: boolean;
        minReservations: number;
    };
}

export interface Notification {
    _id: string;
    user: string;
    type: 'shop_closed' | 'promotion_new' | 'promotion_expiring';
    title: string;
    message: string;
    isRead: boolean;
    metadata: {
        shopId?: string;
        shopName?: string;
        promotionId?: string;
        promotionName?: string;
        reservationId?: string;
        expiryDate?: string;
    };
    createdAt: string;
}