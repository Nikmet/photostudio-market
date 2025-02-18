"use client";

import { cn } from "@/lib";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "./ui";

export interface IThemeSwitcherProps {
    className?: string;
}

export const ThemeSwitcher = ({ className }: IThemeSwitcherProps): React.JSX.Element => {
    const { setTheme } = useTheme();

    return (
        <div className={cn("flex gap-2", className)}>
            <Sun size={20} />
            <Switch onCheckedChange={checked => setTheme(checked ? "dark" : "light")} />
            <Moon size={20} />
        </div>
    );
};
