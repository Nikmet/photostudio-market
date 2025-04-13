import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = cookies();
    (await cookieStore).set("cookies-accepted", "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 год
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    return NextResponse.json({ success: true });
}
