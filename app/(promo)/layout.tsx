import { Header } from "@/components/header";

export default async function PromoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-full">
            <Header isPromo />
            <div className="flex-1 p-4">{children}</div>
        </div>
    );
}
