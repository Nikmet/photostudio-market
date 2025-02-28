"use client";

import { IPage } from "@/@types/page";
import { cn } from "@/lib";
import { usePagesStore } from "@/store/pages-store";
import Link from "next/link";
import React from "react";

export interface IMenuBarProps {
    className?: string;
    pages: IPage[];
    adminPage?: boolean;
}

export const MenuBar = ({ pages, adminPage, className }: IMenuBarProps): React.JSX.Element => {
    const { addPage, openPages, setActivePage } = usePagesStore();

    const handleClick = (page: IPage) => {
        const findPage = openPages.find(p => p.name === page.name);
        setActivePage(page);
        if (findPage) {
            return;
        }
        addPage(page);
    };

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
                        onClick={() => handleClick(page)}
                        className="block p-4 dark:text-white text-black hover:bg-primary/5"
                    >
                        {page.name}
                    </Link>
                ))}
            </div>

            {!adminPage && (
                <Link href="/admin" className="p-4 dark:text-white text-black underline">
                    Панель Администратора
                </Link>
            )}
        </div>
    );
};
