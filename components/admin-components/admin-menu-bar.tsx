"use client";

import { IAdminPage, IPage } from "@/@types/page";
import { cn } from "@/lib";
import { usePagesStore } from "@/store/pages-store";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

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
        if (!findPage) {
            addPage(page);
        }
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    return (
        <div
            className={cn(
                "w-[300px] h-full bg-gradient-to-b from-blue-600/90 to-blue-500/80 dark:from-blue-950/95 dark:to-blue-900/90 backdrop-blur-md rounded-md shadow-lg overflow-hidden  flex flex-col",
                className
            )}
        >
            <div className="flex-1 overflow-y-auto scrollbar py-4 px-2">
                {pages.map(page => (
                    <div key={page.category}>
                        <div
                            className="flex items-center text-white/90 hover:text-white cursor-pointer p-3 rounded-md hover:bg-white/10 transition-colors duration-200"
                            onClick={() => toggleCategory(page.category)}
                        >
                            {expandedCategories.includes(page.category) ? (
                                <ChevronDown className="w-4 h-4 mr-2 text-white/70" />
                            ) : (
                                <ChevronRight className="w-4 h-4 mr-2 text-white/70" />
                            )}
                            <span className="font-medium">{page.category}</span>
                        </div>
                        <AnimatePresence>
                            {expandedCategories.includes(page.category) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {page.pages.map(subpage => (
                                        <Link
                                            key={subpage.href}
                                            href={subpage.href}
                                            onClick={() => handleClick(subpage)}
                                            className="block pl-8 pr-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition rounded-md"
                                        >
                                            {subpage.name}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                <div className="mt-4 border-t border-white/10 pt-4 space-y-1">
                    {[
                        { name: "Промокоды", href: "/admin/promo-codes" },
                        { name: "Клиенты", href: "/admin/clients" },
                        { name: "Заказы", href: "/admin/orders" },
                        { name: "Все продукты", href: "/admin/products" },
                        { name: "Цены", href: "/admin/prices" },
                        { name: "Промо-страницы", href: "/admin/promo" }
                    ].map(page => (
                        <Link
                            key={page.href}
                            href={page.href}
                            onClick={() => handleClick(page)}
                            className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition rounded-md"
                        >
                            {page.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
