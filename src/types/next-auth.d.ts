import { DefaultSession, DefaultUser } from "next-auth";


export type AppRole = "ADMIN" | "RECYCLER" | "ALLY";

// 1. Extendemos los tipos principales de NextAuth
declare module "next-auth" {
    // Extendemos la sesión que usaremos en el frontend (useSession)
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            role: AppRole | string;
        } & DefaultSession["user"];
    }

    // Extendemos el usuario que retornamos desde la función 'authorize'
    interface User extends DefaultUser {
        id: string;
        role: AppRole | string;
        token: string;
    }
}

// 2. Extendemos el tipo del Token JWT
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: AppRole | string;
        accessToken: string;
    }
}