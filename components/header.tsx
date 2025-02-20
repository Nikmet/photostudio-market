import { cn } from "@/lib";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import React, { Suspense } from "react";
import Link from "next/link";
import { ThemeImage } from "./theme-image";

export interface IHeaderProps {
    className?: string;
}

export const Header: React.FC<IHeaderProps> = ({ className }) => {
    return (
        <header
            className={cn(
                "header-animation bg-secondary -translate-y-[100%] m-4 mb-0 rounded-md items-center justify-between p-4 flex",
                className
            )}
        >
            <Suspense>
                <Link href="/">
                    <ThemeImage
                        darkSrc="/logo_dark.svg"
                        lightSrc="/logo_light.svg"
                        alt="Фотостудия-Маркет"
                        className="md:h-5 h-4"
                    />
                </Link>
            </Suspense>

            <p className="hidden lg:block">Поиск</p>
            <div className="flex items-center gap-3 2xl:gap-4">
                <ThemeSwitcher />

                {/* Кнопки для авторизации */}
                <Button
                    variant={"outline"}
                    className="dark:border-solid dark:border-white dark:border-1 shadow-none text-black hidden md:flex "
                >
                    Войти
                </Button>
                <Button
                    variant={"outline"}
                    className="dark:border-solid dark:border-white dark:border-1 bg-transparent dark:text-white shadow-none text-black md:hidden flex h-7 w-7"
                >
                    <User />
                </Button>

                {/* Кнопки для корзин */}
                <Button className="dark:text-white hidden md:flex">
                    Корзина <ArrowRight />
                </Button>
                <Button className="dark:text-white md:hidden h-7 w-7">
                    <ShoppingCart />
                </Button>
            </div>
        </header>
    );
};
