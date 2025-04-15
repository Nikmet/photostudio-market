"use client";

import { IPage } from "@/@types/page";
import { cn } from "@/lib";
import { usePagesStore } from "@/store/pages-store";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export interface IPagesTabProps {
    className?: string;
}

export const PagesTab = ({ className }: IPagesTabProps): React.JSX.Element => {
    const { openPages, removePage, activePage, setActivePage, clearPages } = usePagesStore();
    const router = useRouter();

    const handleDelete = (page: IPage, e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e) e.preventDefault();
        const isActivePage = activePage?.name === page.name;

        if (openPages.length === 1) {
            router.push("/admin");
            removePage(page);
            return;
        }

        if (isActivePage) {
            const index = openPages.findIndex(p => p.name === activePage.name);
            if (openPages.at(index + 1)) {
                setActivePage(openPages.at(index + 1) as IPage);
                router.push((openPages.at(index + 1) as IPage).href);
            } else {
                setActivePage(openPages.at(index - 1) as IPage);
                router.push((openPages.at(index - 1) as IPage).href);
            }
            removePage(page);
        } else {
            removePage(page);
        }
    };

    const onClick = (page: IPage) => {
        router.push(page.href);
        setActivePage(page);
    };

    const closeAll = () => {
        clearPages();
        router.push("/admin");
    };

    return (
        <div className={cn("flex h-10 bg-secondary/50 w-full items-center rounded-md", className)}>
            <div className="relative flex-1 h-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 right-0 flex overflow-x-auto scrollbar-hide pb-2">
                    <div className="flex gap-1 h-full items-center px-1">
                        {openPages.map((page, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1 bg-secondary cursor-pointer rounded-md transition-colors",
                                    {
                                        "border-b-2 border-primary bg-slate-300 dark:bg-indigo-900":
                                            activePage?.name === page.name
                                    }
                                )}
                                onMouseDown={e => e.button === 1 && handleDelete(page, e)}
                                onClick={() => onClick(page)}
                            >
                                <div className="text-sm whitespace-nowrap">{page.name}</div>
                                <CircleX
                                    size={14}
                                    className="opacity-70 hover:opacity-100 transition-opacity"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDelete(page);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {openPages.length > 1 && (
                <button
                    className="ml-auto px-4 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                    onClick={closeAll}
                >
                    Закрыть все
                </button>
            )}
        </div>
    );
};
