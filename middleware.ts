// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Защита checkout роута для неавторизованных пользователей
    if (pathname.startsWith("/checkout")) {
        if (!token) {
            return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
        }
    }

    if (pathname.startsWith("/profile")) {
        if (!token) {
            return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
        }
    }
    if (pathname.startsWith("/advertising")) {
        if (!token) {
            return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
        }
    }
    if (pathname.startsWith("/frames")) {
        if (!token) {
            return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
        }
    }
    if (pathname.startsWith("/souvenirs")) {
        if (!token) {
            return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
        }
    }

    // Защищаем админские маршруты и API
    if (pathname.startsWith("/admin")) {
        // 1. Если пользователь не авторизован - редирект на логин
        if (!token) {
            return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
        }

        // 2. Если пользователь не админ - редирект на 403
        if (token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/403", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/checkout/:path*",
        "/profile/:path*",
        "/advertising/:path*",
        "/frames/:path*",
        "/souvenirs/:path*"
    ]
};
