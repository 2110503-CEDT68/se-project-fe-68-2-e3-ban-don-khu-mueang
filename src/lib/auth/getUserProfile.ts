import { apiBaseUrl } from "../config";

export default async function getUserProfile(token: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }

}
