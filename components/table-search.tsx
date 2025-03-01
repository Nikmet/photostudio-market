"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui";
import { cn } from "@/lib";
import React from "react";
import { useRouter } from "next/navigation";
import { usePagesStore } from "@/store/pages-store";
import { IPage } from "@/@types/page";

export interface ITableSearchProps<T> {
    className?: string;
    data: T[];
    route: string;
}

export const TableSearch = <T extends { id: string }>({
    data,
    route,
    className
}: ITableSearchProps<T>): React.JSX.Element => {
    const { setActivePage, addPage } = usePagesStore();
    const [search, setSearch] = React.useState("");
    const router = useRouter();

    const handleClick = () => {
        const filteredSearch = data.filter(item => item.id == search);

        if (filteredSearch.length === 0) {
            //TODO: Toaster
            return;
        }

        const page: IPage = {
            href: `/admin/${route}/${search}`,
            name: search
        };

        addPage(page);
        setActivePage(page);
        router.push(page.href);
    };

    return (
        <div className={cn("flex items-center gap-2 px-2 py-1", className)}>
            <Input
                className="w-[400px]"
                placeholder="Введите номер"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <Button onClick={handleClick}>
                <Search />
            </Button>
        </div>
    );
};
