"use client";

import { useTheme } from "next-themes";
import { JSX } from "react";
import { Switch } from "./ui";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib";

export interface IThemeButtonProps {
    className?: string;
}

export const ThemeSwitcher = ({ className }: IThemeButtonProps): JSX.Element => {
    const { setTheme } = useTheme();

    return (
        <div className={cn("flex gap-2", className)}>
            <Sun size={20} />
            <Switch onCheckedChange={checked => setTheme(checked ? "dark" : "light")} />
            <Moon size={20} />
        </div>
    );
};
