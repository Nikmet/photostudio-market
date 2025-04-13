"use client";

import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";

export function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const cookiesAccepted = document.cookie.includes("cookies-accepted=true");
        setVisible(!cookiesAccepted);
    }, []);

    const acceptCookies = () => {
        setCookie("cookies-accepted", "true", {
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 год
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white shadow-md border-t border-gray-200 p-4 z-50 w-[80%]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь
                    с нашей{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                        Политикой конфиденциальности
                    </a>
                    .
                </p>
                <button
                    onClick={acceptCookies}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
                >
                    Принять
                </button>
            </div>
        </div>
    );
}
