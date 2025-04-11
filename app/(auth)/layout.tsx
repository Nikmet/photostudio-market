import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Фотостудия-Маркет | Авторизация",
    description: "Страница авторизации"
};

export default async function AuthLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <main className="flex h-[94vh] w-full">
                <div className="w-full h-full">{children}</div>
            </main>
        </>
    );
}
