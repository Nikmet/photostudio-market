import { Header } from "@/components/header";
import { cookies } from "next/headers";

export default async function PromoLayout({ children }: { children: React.ReactNode }) {
    const authCookie = (await cookies()).get("auth");

    return (
        <div className="flex flex-col h-full">
            <Header admin={Boolean(authCookie?.value)} />
            <div className="flex-1 py-4 pr-4">{children}</div>
        </div>
    );
}
