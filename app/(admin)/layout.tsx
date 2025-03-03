import type { Metadata } from "next";
import { Header } from "@/components/header";
import { adminPages } from "@/constants/pages";
import { PagesTab } from "@/components/pages-tab";
import { AdminMenuBar } from "@/components/admin-menu-bar";

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

            <main className="flex h-[85.5vh] w-full p-4">
                <AdminMenuBar pages={adminPages} />
                <div className="w-full h-full view-animation">
                    <PagesTab />
                    {children}
                </div>
            </main>
        </>
    );
}
