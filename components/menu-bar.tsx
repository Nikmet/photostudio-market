"use client";

import { IPage } from "@/@types/page";
import { cn } from "@/lib";
import { Menu, X, Settings, Image, Gift, Smartphone, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

// Маппинг иконок для пунктов меню
const getPageIcon = (pageName: string) => {
    switch (pageName.toLowerCase()) {
        case "сувениры":
            return <Gift className="w-5 h-5" />;
        case "реклама":
            return <Smartphone className="w-5 h-5" />;
        case "фоторамки":
            return <Image className="w-5 h-5" />;
        case "контакты":
            return <Phone className="w-5 h-5" />;
    }
};

export interface IMenuBarProps {
    className?: string;
    pages: IPage[];
}

export const MenuBar = ({ pages, className }: IMenuBarProps): React.JSX.Element => {
    const session = useSession();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            {/* Кнопка открытия меню */}
            <button
                className={cn(
                    "md:hidden fixed left-4 top-[25px] z-40 p-2",
                    "transition-opacity duration-300",
                    "text-white hover:text-gray-200",
                    isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Оверлей */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-30",
                    "transition-opacity duration-300",
                    isOpen ? "opacity-100 md:opacity-0" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Меню */}
            <div
                className={cn(
                    "fixed md:relative inset-y-0 left-0 md:inset-auto rounded-md",
                    "w-[300px] h-full",
                    "transform transition-transform duration-300",
                    "flex flex-col z-40",
                    "bg-gradient-to-b from-blue-600/90 to-blue-500/80 dark:from-blue-950/95 dark:to-blue-900/90",
                    "backdrop-blur-sm",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    className
                )}
            >
                {/* Кнопка закрытия */}
                <button
                    className="md:hidden absolute right-4 top-4 p-2 text-white hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Содержимое меню */}
                <div className="flex-1 overflow-y-auto pt-16 md:pt-4 px-4">
                    {pages.map(page => (
                        <Link
                            key={page.href}
                            href={page.href}
                            className={cn(
                                "flex items-center gap-3 p-4 text-white/90 hover:text-white hover:bg-white/10",
                                "transition-colors duration-200 rounded-md"
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            {getPageIcon(page.name)}
                            <span>{page.name}</span>
                        </Link>
                    ))}
                </div>

                {session.data?.user.role === "ADMIN" && (
                    <Link
                        href="/admin"
                        className={cn(
                            "flex items-center gap-3 p-4 text-white/80 hover:text-white",
                            "border-t border-white/10 hover:bg-white/5",
                            "transition-colors duration-200"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Settings className="w-5 h-5" />
                        <span>Панель Администратора</span>
                    </Link>
                )}
            </div>
        </>
    );
};
