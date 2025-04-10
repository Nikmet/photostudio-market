"use client";

import { cn } from "@/lib";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui";
import { ArrowRight, ShoppingCart } from "lucide-react";
import React, { Suspense } from "react";
import { HeaderLogo } from "./header-logo";
import Link from "next/link";
import { useSession } from "next-auth/react";

export interface IHeaderProps {
    className?: string;
    admin?: boolean;
}

export const Header: React.FC<IHeaderProps> = ({ admin, className }) => {
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
                    <HeaderLogo admin={admin} />
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
                        <Link
                            className="dark:border-solid dark:border-white border-1 shadow-none text-black hidden md:flex border-solid border-black bg-transparent"
                            href="/profile"
                        >
                            <div className="flex gap-2 items-center">
                                <img
                                    src={session.data.user.image ?? ""}
                                    alt="фото профиля"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <span>Профиль</span>
                            </div>
                        </Link>
                    )}
                    {/* Кнопки для корзин */}
                    <Button className="dark:text-white hidden md:flex">
                        Корзина <ArrowRight />
                    </Button>
                    <Button className="dark:text-white md:hidden h-7 w-7">
                        <ShoppingCart />
                    </Button>
                </div>
            </header>
        </>
    );
};
