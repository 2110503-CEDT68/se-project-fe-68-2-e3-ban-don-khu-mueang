import { apiBaseUrl } from "../config";

export interface ReservationResult {
    success: boolean;
    count: number;
    data: ReservationItem[];
}

export interface ReservationUser {
    _id: string;
    name: string;
    tel: string;
    email: string;
}

export interface ReservationMassage {
    _id: string;
    name: string;
    province: string;
    tel: string;
    pictures?: string[];
}

export interface ReservationItem {
    _id: string;
    reserveDate: string;
    user: ReservationUser | string;
    massage: ReservationMassage | string;
    rating?: number;
    isRated?: boolean;
    createdAt: string;
}

export default async function getReservation(_token: string): Promise<ReservationResult> {
    void _token; // To silence the unused variable linter error

    // TODO: Replace with actual API fetch when ready
    const response = await fetch(`${apiBaseUrl}/api/reservations?limit=10000`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${_token}`
        },
        cache: "no-store"
    });
    if (!response.ok) throw new Error("Failed to fetch reservations");
    return response.json();

    // Mock data for now
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve({
    //             success: true,
    //             count: 2,
    //             data: [
    //                 {
    //                     _id: "1",
    //                     reserveDate: "2024-10-24T10:00:00.000Z",
    //                     user: "user_id_1",
    //                     massage: {
    //                         _id: "massage_1",
    //                         name: "Massages",
    //                         province: "Bangkok",
    //                         tel: "0123456789",
    //                         pictures: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop"]
    //                     },
    //                     createdAt: "2024-10-01T10:00:00.000Z"
    //                 },
    //                 {
    //                     _id: "2",
    //                     reserveDate: "2024-10-28T14:00:00.000Z",
    //                     user: "user_id_1",
    //                     massage: {
    //                         _id: "massage_2",
    //                         name: "Boutique spa",
    //                         province: "Chiang Mai",
    //                         tel: "0987654321",
    //                         pictures: ["https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=400&fit=crop"]
    //                     },
    //                     createdAt: "2024-10-02T10:00:00.000Z"
    //                 }
    //             ]
    //         });
    //     }, 500); // Simulate network delay
    // });
}
