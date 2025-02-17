"use client"

import { useTheme } from "next-themes";
import { JSX } from "react";
import { Button } from "./ui/button";

export interface IThemeButtonProps {
    className?: string;
}

export const ThemeButton = ({ className }: IThemeButtonProps): JSX.Element => {
    const { setTheme } = useTheme();

    return (
        <>
            <Button className={className} onClick={() => setTheme("dark")}>
                Темная
            </Button>
            <Button className={className} onClick={() => setTheme("light")}>
                Светлая
            </Button>
        </>
    );
};
