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
            setActivePage(null);
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

    //TODO: Сделать нормальный скроллбар
    return (
        <div className={cn("flex h-10 bg-secondary/50 w-full items-center rounded-md ", className)}>
            <div className="overflow-auto scrollbar flex gap-1 h-full">
                {openPages.map((page, index) => (
                    <div
                        key={index}
                        className={cn("flex items-center gap-2 px-2 bg-secondary cursor-pointer", {
                            "border-b-2 border-primary bg-slate-300 dark:bg-indigo-900": activePage?.name === page.name
                        })}
                        onMouseDown={e => e.button === 1 && handleDelete(page, e)}
                        onClick={() => onClick(page)}
                    >
                        <div>{page.name}</div>
                        <CircleX
                            size={16}
                            onClick={e => {
                                e.stopPropagation();
                                handleDelete(page);
                            }}
                        />
                    </div>
                ))}
            </div>

            <a className="ml-auto px-5 cursor-pointer underline" onClick={closeAll}>
                Закрыть все
            </a>
        </div>
    );
};
