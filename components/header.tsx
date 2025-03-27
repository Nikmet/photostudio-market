import { cn } from "@/lib";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import React, { Suspense } from "react";
import { HeaderLogo } from "./header-logo";
import Link from "next/link";

export interface IHeaderProps {
    className?: string;
    admin?: boolean;
}

export const Header: React.FC<IHeaderProps> = ({ admin, className }) => {
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
                    {!admin && (
                        <Link
                            className="dark:border-solid dark:border-white border-1 shadow-none text-black hidden md:flex border-solid border-black bg-transparent"
                            href="/login"
                        >
                            Войти
                        </Link>
                    )}
                    {admin && (
                        <Button
                            variant={"outline"}
                            className="dark:border-solid dark:border-white dark:border-1 bg-transparent dark:text-white shadow-none text-black flex h-7"
                        >
                            <User />
                            Администратор
                        </Button>
                    )}

                    {/* Кнопки для корзин */}
                    {!admin && (
                        <>
                            <Button className="dark:text-white hidden md:flex">
                                Корзина <ArrowRight />
                            </Button>
                            <Button className="dark:text-white md:hidden h-7 w-7">
                                <ShoppingCart />
                            </Button>
                        </>
                    )}
                </div>
            </header>
        </>
    );
};
