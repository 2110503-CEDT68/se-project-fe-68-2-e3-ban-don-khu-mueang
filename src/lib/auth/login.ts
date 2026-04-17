import { apiBaseUrl } from "../config";

export default async function userLogIn(userEmail: string, userPassword: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed. Please try again.");
        }
        return await response.json();

    } catch (error) {
        console.error("Error during login:", error);
        throw new Error("Login failed. Please try again.");
    }

}
