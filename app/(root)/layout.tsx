import { Header } from "@/components/header";
import { MenuBar } from "@/components/menu-bar";
import { clientPages } from "@/constants/pages";
import { cookies } from "next/headers";

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authCookie = (await cookies()).get("auth");

    return (
        <>
            <Header admin={Boolean(authCookie?.value)} />
            <main className="flex h-[85vh] w-full">
                <MenuBar pages={clientPages} className="ml-4 mt-4 h-[82vh]" isAdmin={Boolean(authCookie?.value)} />
                <div className="w-full h-full py-4 pr-4 overflow-auto scrollbar">{children}</div>
            </main>
        </>
    );
}
