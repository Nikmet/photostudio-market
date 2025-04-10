"use client";

import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";

interface IProvidersProps {
    children: React.ReactNode;
    theme: string;
}

export const Providers = ({ theme, children }: IProvidersProps): React.JSX.Element => {
    return (
        <>
            <SessionProvider>
                <Toaster />
                <NextTopLoader />
                <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>
            </SessionProvider>
        </>
    );
};
