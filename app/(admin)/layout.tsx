import type { Metadata } from "next";
import { Header } from "@/components/header";
import { adminPages } from "@/constants/pages";
import { PagesTab } from "@/components/admin-components/pages-tab";
import { AdminMenuBar } from "@/components/admin-components/admin-menu-bar";

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
            <Header />
            <main className="flex h-[86vh] w-full p-4">
                <AdminMenuBar pages={adminPages} />
                <div className="w-full h-full view-animation">
                    <PagesTab />
                    <div className="h-full w-full overflow-auto scrollbar">{children}</div>
                </div>
            </main>
        </>
    );
}
