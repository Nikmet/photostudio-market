"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider defaultTheme="system" enableSystem {...props} attribute={"class"} >
            {children}
        </NextThemesProvider>
    );
}
