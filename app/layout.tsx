import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { MenuBar } from "@/components/menu-bar";
import { clientPages } from "@/constants/pages";

export const metadata: Metadata = {
    title: "Фотостудия-Маркет | Главная"
};

const main_font = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"]
});

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const theme = cookieStore.get("theme")?.value || "dark";

    return (
        <html lang="ru" className={theme} style={{ colorScheme: theme }}>
            <body className={main_font.className}>
                <ThemeProvider defaultTheme={theme}>
                    <Header />
                    <main className="flex h-[91vh] w-full">
                        <MenuBar pages={clientPages} />
                        <div className="w-full h-full">{children}</div>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
