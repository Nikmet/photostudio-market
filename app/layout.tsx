import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "Фотостудия-Маркет | Главная"
};

const main_font = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"]
});

export default async function MainLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const theme = cookieStore.get("theme")?.value || "dark";

    return (
        <html lang="ru" className={theme} style={{ colorScheme: theme }}>
            <body className={main_font.className}>
                <Providers theme={theme}>{children}</Providers>
            </body>
        </html>
    );
}
