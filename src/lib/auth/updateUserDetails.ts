import { apiBaseUrl } from "../config";

interface UpdateDetailsPayload {
    name: string;
    email: string;
    tel: string;
    currentPassword?: string;
}

export default async function updateUserDetails(token: string, data: UpdateDetailsPayload) {
    const response = await fetch(`${apiBaseUrl}/api/auth/updatedetails`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to update user details");
    }

    return result;
}