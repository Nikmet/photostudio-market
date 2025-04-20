import { Header } from "@/components/header";
import { MenuBar } from "@/components/menu-bar";
import { clientPages } from "@/constants/pages";
import { cn } from "@/lib";

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <main className="flex h-[85vh] w-full p-4 relative">
                <MenuBar pages={clientPages} className="md:mr-4" />
                <div
                    className={cn(
                        "flex-1 h-full overflow-auto scrollbar",
                        "md:ml-0 ml-0" // Добавляем отступ только для мобильных при открытом меню
                    )}
                >
                    {children}
                </div>
            </main>
        </>
    );
}
