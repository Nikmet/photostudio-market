"use client";

import { cn } from "@/lib";
import { ThemeSwitcher } from "./theme-switcher";
import React, { Suspense } from "react";
import { HeaderLogo } from "./header-logo";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CartDrawer } from "./cart-drawer";

export interface IHeaderProps {
    className?: string;
}

export const Header: React.FC<IHeaderProps> = ({ className }) => {
    const session = useSession();

    return (
        <>
            <header
                className={cn(
                    "header-animation bg-secondary -translate-y-[100%] m-4 mb-0 rounded-md items-center justify-between p-4 flex",
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
                            className="dark:border-solid dark:border-white border-1 shadow-none text-black hidden md:flex border-solid border-black bg-transparent"
                            href="/login"
                        >
                            Войти
                        </Link>
                    )}
                    {session.data?.user && (
                        <Link className="" href="/profile">
                            <div className="gap-2 items-center dark:border-white border shadow-none hidden md:flex border-solid border-black py-1 px-3 rounded-md hover:bg-slate-100 transition-all duration-200">
                                <img
                                    src={session.data.user.photo ?? "/avatar.png"}
                                    alt="фото профиля"
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm">Профиль</span>
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
