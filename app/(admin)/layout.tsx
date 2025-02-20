import type { Metadata } from "next";
import { Header } from "@/components/header";
import { MenuBar } from "@/components/menu-bar";
import { clientPages } from "@/constants/pages";

export const metadata: Metadata = {
    title: "Фотостудия-Маркет | Панель Администратора"
};

export default async function AdminLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header admin={true} />
            <main className="flex h-[91vh] w-full">
                <MenuBar pages={clientPages} />
                <div className="w-full h-full">{children}</div>
            </main>
        </>
    );
}
