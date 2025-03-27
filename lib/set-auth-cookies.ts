import { cookies } from "next/headers";

export async function setAuthCookie(isAdmin: boolean) {
    (await cookies()).set("auth", String(isAdmin), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/"
    });
}
