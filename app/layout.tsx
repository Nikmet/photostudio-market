import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@vercel/analytics/next";

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
    const cookieStore = cookies();
    const theme = (await cookieStore).get("theme")?.value || "dark";

    return (
        <html lang="ru" className={theme} style={{ colorScheme: theme }}>
            <body className={`${main_font.className} flex flex-col min-h-screen`}>
                <Providers theme={theme}>
                    <main className="flex-grow">{children}</main>
                    <CookieConsent />
                    <Analytics />
                </Providers>
                <footer className="mt-auto bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900 p-2 view-animation">
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-center text-sm text-blue-900 dark:text-blue-100">
                            © {new Date().getFullYear()} ООО &quot;Фотостудия-М&quot;
                        </p>
                        <p className="text-center text-sm text-blue-900 dark:text-blue-100">{process.env.VERSION}</p>
                    </div>
                </footer>{" "}
            </body>
        </html>
    );
}
