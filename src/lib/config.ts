export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "https://e3-be.vercel.app" : "http://localhost:5000");
