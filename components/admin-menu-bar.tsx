"use client";

import { IAdminPage, IPage } from "@/@types/page";
import { cn } from "@/lib";
import { usePagesStore } from "@/store/pages-store";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface IAdminMenuBarProps {
    className?: string;
    pages: IAdminPage[];
}

export const AdminMenuBar = ({ pages, className }: IAdminMenuBarProps): React.JSX.Element => {
    const { addPage, openPages, setActivePage } = usePagesStore();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const handleClick = (page: IPage) => {
        const findPage = openPages.find(p => p.name === page.name);
        setActivePage(page);
        if (findPage) {
            return;
        }
        addPage(page);
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
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
                    <div key={page.category}>
                        <div
                            className="p-4 pb-2 dark:text-white text-black cursor-pointer flex items-center"
                            onClick={() => toggleCategory(page.category)}
                        >
                            <span className="mr-1 text-sm text-slate-400">
                                {expandedCategories.includes(page.category) ? "▼" : "▶"}
                            </span>
                            {page.category}
                        </div>
                        <AnimatePresence>
                            {expandedCategories.includes(page.category) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {page.pages.map(page => (
                                        <Link
                                            key={page.href}
                                            href={page.href}
                                            className="block p-2 dark:text-white text-black/80 hover:bg-primary/5 pl-8"
                                            onClick={() => handleClick(page)}
                                        >
                                            {page.name}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                <Link
                    href="/admin/clients"
                    className="p-4 pl-4 pb-2 dark:text-white text-black cursor-pointer block hover:bg-primary/5"
                >
                    Клиенты
                </Link>
                <Link
                    href="/admin/orders"
                    className="p-4 pl-4 pb-2 dark:text-white text-black cursor-pointer block hover:bg-primary/5"
                >
                    Заказы
                </Link>
                <Link
                    href="/admin/products"
                    className="p-4 pl-4 pb-2 dark:text-white text-black cursor-pointer block hover:bg-primary/5"
                >
                    Все продукты
                </Link>
                <Link
                    href="/admin/prices"
                    className="p-4 pl-4 pb-2 dark:text-white text-black cursor-pointer block hover:bg-primary/5"
                >
                    Цены
                </Link>
            </div>
        </div>
    );
};
