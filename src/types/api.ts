export interface ApiListResponse<T> {
    success: boolean;
    count: number;
    data: T[];
    totalCount?: number;
    pagination?: {
        next?: { page: number; limit: number };
        prev?: { page: number; limit: number };
    };
}

export interface ApiItemResponse<T> {
    success: boolean;
    data: T;
}

export interface AdminShop {
    _id: string;
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    pictures: string[];
    price: number;
    averageRating?: number;
    userRatingCount?: number;
}

export interface PopulatedUser {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    tel?: string;
    avatarKey?: string | null;
    avatarUrl?: string | null;
}

export interface PopulatedMassage {
    _id?: string;
    id?: string;
    name?: string;
    province?: string;
    tel?: string;
}

export interface AdminReservation {
    _id: string;
    reserveDate: string;
    user: string | PopulatedUser;
    massage: string | PopulatedMassage;
    rating?: number;
    isRated?: boolean;
    createdAt?: string;
}

export interface AdminUser {
    _id: string;
    name: string;
    tel: string;
    email: string;
    role: string;
    avatarKey?: string | null;
    avatarUrl?: string | null;
    createdAt?: string;
}

export interface CreateShopInput {
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    price: number;
    pictures?: string[];
}

export interface RegisterAdminInput {
    name: string;
    email: string;
    password: string;
    tel: string;
}