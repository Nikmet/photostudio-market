import type { Metadata } from "next";
import { Header } from "@/components/header";
import { adminPages } from "@/constants/pages";
import { PagesTab } from "@/components/pages-tab";
import { AdminMenuBar } from "@/components/admin-menu-bar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Фотостудия-Маркет | Панель Администратора"
};

export default async function AdminLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authCookie = (await cookies()).get("auth");

    if (!Boolean(authCookie?.value)) {
        redirect("/not-allowed");
    }

    return (
        <>
            <Header admin={true} />

            <main className="flex h-[85vh] w-full p-4">
                <AdminMenuBar pages={adminPages} />
                <div className="w-full h-full view-animation">
                    <PagesTab />
                    {children}
                </div>
            </main>
        </>
    );
}
