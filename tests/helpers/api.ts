const API_BASE = 'https://e3-be.vercel.app';

//api for authen
export async function getAuthToken(email: string, password: string): Promise<string> {
    for (let i = 0; i < 3; i++) {
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Non-JSON auth resp:", text);
                throw new Error("Invalid JSON: " + text.substring(0, 50));
            }
            if (data.token) return data.token;
        } catch (e) {
            if (i === 2) throw e;
            await new Promise(r => setTimeout(r, 1000)); // sleep and retry
        }
    }
    throw new Error("Failed to get auth token");
}

//api for manage shop
export async function createShopViaApi(token: string, shopData: object) {
    const res = await fetch(`${API_BASE}/api/massages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
    });
    return res.json();
}

export async function deleteShopViaApi(token: string, shopId: string) {
    const res = await fetch(`${API_BASE}/api/massages/${shopId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
}

//api for manage reservation
export async function createReservationViaApi(token: string, shopId: string, date: string) {
    const res = await fetch(`${API_BASE}/api/massages/${shopId}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reserveDate: date }),
    });
    return res.json();
}

//api for manage promotion
export async function createPromotionViaApi(token: string, promotionData: object) {
    const res = await fetch(`${API_BASE}/api/promotions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(promotionData),
    });
    return res.json();
}

export async function getPromotionsViaApi(token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/api/promotions`, { headers });
    return res.json();
}

export async function deletePromotionViaApi(token: string, promotionId: string) {
    const res = await fetch(`${API_BASE}/api/promotions/${promotionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
}

export async function updatePromotionViaApi(token: string, promotionId: string, data: object) {
    const res = await fetch(`${API_BASE}/api/promotions/${promotionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

//api for manage review
export async function createReviewViaApi(
    token: string,
    reservationId: string,
    rating: number,
    comment?: string
) {
    const payload: { reservation: string; rating: number; comment?: string } = {
        reservation: reservationId,
        rating,
    };
    if (comment) payload.comment = comment;
    const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function deleteReviewViaApi(token: string, reviewId: string) {
    const res = await fetch(`${API_BASE}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
}

export async function getShopReviewsViaApi(shopId: string) {
    const res = await fetch(`${API_BASE}/api/massages/${shopId}/reviews`);
    return res.json();
}

export async function getAllReviewsViaApi(token: string) {
    const res = await fetch(`${API_BASE}/api/reviews`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
}

export async function getShopsViaApi() {
    const res = await fetch(`${API_BASE}/api/massages`);
    return res.json();
}

//api for manage notification
export async function getNotificationsViaApi(token: string) {
    const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
}

export async function triggerExpiringPromotionsCron(cronSecret: string) {
    const res = await fetch(
        `${API_BASE}/api/cron/check-expiring-promotions?secret=${cronSecret}`,
    );
    return res.json();
}
