import { Header } from "@/components/header";
import { MenuBar } from "@/components/menu-bar";
import { clientPages } from "@/constants/pages";

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <main className="flex h-[85vh] w-full">
                <MenuBar pages={clientPages} className="ml-4 mt-4 h-[82vh]" />
                <div className="w-full h-full py-4 pr-4 overflow-auto scrollbar">{children}</div>
            </main>
        </>
    );
}
