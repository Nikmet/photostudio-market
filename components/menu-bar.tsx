"use client";

import { IPage } from "@/@types/page";
import { cn } from "@/lib";
import Link from "next/link";
import React from "react";

export interface IMenuBarProps {
    className?: string;
    pages: IPage[];
    isAdmin?: boolean;
}

export const MenuBar = ({ pages, isAdmin, className }: IMenuBarProps): React.JSX.Element => {
    return (
        <div
            className={cn(
                "menu-bar-animation w-[300px] bg-secondary mr-4 rounded-md -translate-x-[110%] flex flex-col align-center justify-between",
                className
            )}
        >
            <div className="scrollbar overflow-auto">
                {pages.map(page => (
                    <Link
                        key={page.href}
                        href={page.href}
                        className="block p-4 dark:text-white text-black hover:bg-primary/5"
                    >
                        {page.name}
                    </Link>
                ))}
            </div>
            {isAdmin && (
                <Link href="/admin" className="p-4 dark:text-white text-black underline">
                    Панель Администратора
                </Link>
            )}
        </div>
    );
};
