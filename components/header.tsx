"use client";

import { cn } from "@/lib";
import { ThemeSwitcher } from "./theme-switcher";
import React, { Suspense } from "react";
import { HeaderLogo } from "./header-logo";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CartDrawer } from "./cart/cart-drawer";

export interface IHeaderProps {
    className?: string;
}

export const Header: React.FC<IHeaderProps> = ({ className }) => {
    const session = useSession();

    return (
        <>
            <header
                className={cn(
                    "header-animation dark:bg-gradient-to-r dark:from-blue-950 dark:to-blue-900/80 bg-gradient-to-r from-blue-600 to-blue-500/80 -translate-y-[100%] m-4 mb-0 rounded-md items-center justify-between p-4 flex pl-[50px] md:pl-4",
                    className
                )}
            >
                <Suspense>
                    <HeaderLogo admin={session.data?.user.role === "ADMIN"} />
                </Suspense>
                <div className="flex items-center gap-3 2xl:gap-4">
                    <ThemeSwitcher />

                    {/* Кнопки для авторизации */}
                    {!session.data?.user && (
                        <Link
                            className="shadow-none text-white border-solid bg-transparent md:text-md text-sm"
                            href="/login"
                        >
                            Войти
                        </Link>
                    )}
                    {session.data?.user && (
                        <Link className="" href="/profile">
                            {/* Десктопная версия (видна на md и выше) */}
                            <div className="gap-2 items-center border-white border shadow-none md:flex hidden border-solid py-1 px-3 rounded-md">
                                <img
                                    src={session.data.user.photo ?? "/avatar.png"}
                                    alt="фото профиля"
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm text-white">Профиль</span>
                            </div>

                            {/* Мобильная версия (видна ниже md) */}
                            <div className="flex items-center border-white border shadow-none md:hidden border-solid py-1 px-3 rounded-md">
                                <img
                                    src={session.data.user.photo ?? "/avatar.png"}
                                    alt="фото профиля"
                                    className="w-4 h-4 rounded-full"
                                />
                            </div>
                        </Link>
                    )}
                    {/* Кнопки для корзин */}
                    {session.data?.user.role === "USER" && <CartDrawer userId={session.data.user.id} />}
                </div>
            </header>
        </>
    );
};
