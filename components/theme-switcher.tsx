"use client";

import { cn } from "@/lib";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "./ui";
import React from "react";
import { getCookie, setCookie } from "cookies-next";

export interface IThemeSwitcherProps {
    className?: string;
}

export const ThemeSwitcher = ({ className }: IThemeSwitcherProps): React.JSX.Element => {
    const { setTheme, systemTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    console.log(systemTheme);

    React.useEffect(() => {
        setMounted(true);

        const savedTheme = getCookie("theme")?.toString();
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (systemTheme) {
            setTheme(systemTheme);
        }
    }, [systemTheme]);

    const handleThemeChange = (checked: boolean) => {
        const newTheme = checked ? "dark" : "light";
        setTheme(newTheme);

        setCookie("theme", newTheme, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/"
        });
    };

    if (!mounted) {
        return <></>;
    }

    return (
        <div className={cn("flex gap-1 md:gap-2", className)}>
            <Sun size={20} />
            <Switch checked={theme == "dark"} onCheckedChange={handleThemeChange} />
            <Moon size={20} />
        </div>
    );
};
