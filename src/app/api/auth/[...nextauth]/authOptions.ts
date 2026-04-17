import { AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogIn from "@/src/lib/auth/login";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials) return null;

                try {
                    const user = await userLogIn(credentials.email, credentials.password);
                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        signOut: "/logout",
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = token as Session["user"];
            return session;
        }
    }
};
