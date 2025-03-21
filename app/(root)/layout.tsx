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
            <Header admin={false} />
            <main className="flex h-[89vh] w-full">
                <MenuBar pages={clientPages} className="ml-4 mt-4" />
                <div className="w-full h-full">{children}</div>
            </main>
        </>
    );
}
