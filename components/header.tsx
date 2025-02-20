"use client";

import { cn } from "@/lib";
import { ThemeSwitcher } from "./theme-switcher";
import { useTheme } from "next-themes";
import { Button } from "./ui";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import React from "react";
import { Container } from "./container";

export interface IHeaderProps {
    className?: string;
}

export const Header: React.FC<IHeaderProps> = ({ className }) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <header className={cn("bg-secondary", className)}>
            <Container className="flex items-center justify-between py-4">
                <img
                    src={theme == "dark" ? "/logo_dark.svg" : "/logo_light.svg"}
                    alt="Фотостудия-Маркет"
                    className="lg:h-5 h-4"
                />
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
            </Container>
        </header>
    );
};
