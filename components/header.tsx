"use client";

import { cn } from "@/lib";
import { ThemeSwitcher } from "./theme-switcher";
import { Container } from "./container";
import { useTheme } from "next-themes";
import { Button } from "./ui";
import { ArrowRight } from "lucide-react";
import React from "react";

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
                    className="h-5"
                />
                <p>Поиск</p>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <Button className="dark:border-solid dark:border-white dark:border-1 bg-transparent dark:text-white shadow-none text-black">
                        Войти
                    </Button>
                    <Button className="dark:text-white">
                        Корзина <ArrowRight />
                    </Button>
                </div>
            </Container>
        </header>
    );
};
