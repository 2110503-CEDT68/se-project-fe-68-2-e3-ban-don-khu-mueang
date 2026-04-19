<<<<<<< HEAD
export const apiBaseUrl = process.env.NODE_ENV === "production" ? "https://e3-backend.vercel.app" : "http://localhost:5000";
=======
export const apiBaseUrl = process.env.NODE_ENV === "production" ? "https://e3-backend.vercel.app" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
>>>>>>> origin/6-4
