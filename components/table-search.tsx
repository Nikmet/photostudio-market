"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui";
import { cn } from "@/lib";
import React from "react";
import { useRouter } from "next/navigation";

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
    const [search, setSearch] = React.useState("");
    const router = useRouter();

    const handleClick = () => {
        const filteredSearch = data.filter(item => item.id == search);

        if (filteredSearch.length === 0) {
            //TODO: Toaster
            return;
        }

        router.push(`/admin/${route}/${search}`);
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
