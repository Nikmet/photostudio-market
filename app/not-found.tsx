import { ThemeImage } from "@/components/theme-image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="p-3 flex flex-col items-center justify-center h-[100vh]">
            <ThemeImage darkSrc="/not-found-dark.svg" lightSrc="/not-found-light.svg" alt="404" />
            <Link
                href="/"
                className="inline-flex items-center gap-2 mt-4 hover:underline transition-all duration-300 hover:-translate-x-1"
            >
                <ArrowLeft /> Вернуться на главную
            </Link>
        </div>
    );
}
