"use client";

import { useTheme } from "next-themes";
import React from "react";

export interface IThemeImageProps {
    className?: string;
    darkSrc: string;
    lightSrc: string;
    alt: string;
}

export const ThemeImage = ({ darkSrc, lightSrc, alt, className }: IThemeImageProps): React.JSX.Element => {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <></>;
    }

    return <img src={theme == "dark" ? darkSrc : lightSrc} alt={alt} className={className} />;
};
