import { apiBaseUrl } from "../config";

export default async function updatePassword(token: string, currentPassword?: string, newPassword?: string) {
    const response = await fetch(`${apiBaseUrl}/api/auth/updatepassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to update password");
    }

    return result;
}