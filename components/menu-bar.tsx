"use client";

import { IPage } from "@/@types/page";
import { cn } from "@/lib";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export interface IMenuBarProps {
    className?: string;
    pages: IPage[];
}

export const MenuBar = ({ pages, className }: IMenuBarProps): React.JSX.Element => {
    const session = useSession();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            {/* Кнопка открытия меню с анимацией */}
            <button
                className={cn(
                    "md:hidden fixed left-4 top-[25px] z-40 p-2",
                    "transition-opacity duration-300",
                    isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Оверлей с анимацией */}
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
                    "fixed md:relative inset-y-0 left-0 md:inset-auto",
                    "w-[300px] bg-secondary h-full",
                    "transform transition-transform duration-300",
                    "flex flex-col z-40",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    className
                )}
            >
                {/* Кнопка закрытия */}
                <button className="md:hidden absolute right-4 top-4 p-2" onClick={() => setIsOpen(false)}>
                    <X className="h-6 w-6" />
                </button>

                {/* Содержимое меню */}
                <div className="flex-1 overflow-y-auto pt-4 md:pt-0">
                    {pages.map(page => (
                        <Link
                            key={page.href}
                            href={page.href}
                            className="block p-4 dark:text-white text-black hover:bg-primary/5"
                            onClick={() => setIsOpen(false)}
                        >
                            {page.name}
                        </Link>
                    ))}
                </div>

                {session.data?.user.role === "ADMIN" && (
                    <Link
                        href="/admin"
                        className="p-4 dark:text-white text-black underline border-t border-gray-200 dark:border-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        Панель Администратора
                    </Link>
                )}
            </div>
        </>
    );
};
