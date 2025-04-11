import { Header } from "@/components/header";

export default async function PromoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-full">
            <Header admin={false} />
            <div className="flex-1 py-4 pr-4">{children}</div>
        </div>
    );
}
