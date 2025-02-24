"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowDown, Search } from "lucide-react";
import { cn } from "@/lib";
import { Checkbox } from "./ui/checkbox";
import { useRouter } from "next/navigation";
import { Button } from "./ui";
import { createUid, getId } from "@/lib/uid";
import { formatTableCell } from "@/lib/format-table-cell";
import { usePagination } from "@/hooks/use-pagination";
import React from "react";
import { Pagination } from "./pagination";

export interface IAdminTableProps<T> {
    className?: string;
    data: T[];
    columns: {
        title: string;
        key: keyof T;
    }[];
    route: string;
    handleDeleteProp?: (ids: string[]) => void;
    prefix?: string;
}

export const AdminTable = <T extends { id: string }>({
    data,
    columns,
    route,
    handleDeleteProp,
    prefix,
    className
}: IAdminTableProps<T>): React.JSX.Element => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const { currentItems, currentPage, totalPages, paginate } = usePagination(data, 15);
    const router = useRouter();

    const handleSelect = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleDelete = (ids: string[]) => {
        handleDeleteProp?.(ids);
    };

    const handleAdd = (id: string) => {
        const newId = (Number(getId(id)) + 1).toString();
        const uid = createUid(prefix ?? "", newId);
        router.push(`/admin/${route}/${uid}`);
    };

    return (
        <div className={cn("pr-5 flex flex-col min-h-[calc(100vh-200px)]", className)}>
            <div className="pr-5 flex flex-col min-h-[calc(100vh-200px)]">
                <div className="flex justify-between mb-3">
                    <Button onClick={() => handleAdd(data[data.length - 1].id)}>Добавить</Button>
                    <div className="bg-gray-300 w-[500px] rounded-md flex items-center justify-between px-2 py-1">
                        Поиск
                        <Search />
                    </div>
                    <div className="flex gap-2">
                        <Button className="bg-red-500" onClick={() => handleDelete(selected)}>
                            Удалить
                        </Button>
                        <Button className="bg-blue-500">
                            Редактировать <ArrowDown />
                        </Button>
                    </div>
                </div>
                <Table className="overflow-x-auto min-w-[1200px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            {columns.map(column => (
                                <TableHead key={column.title}>{column.title}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map(item => (
                            <TableRow
                                key={item.id}
                                className="cursor-pointer"
                                onDoubleClick={() => {
                                    router.push(`/admin/${route}/${item.id}`);
                                }}
                            >
                                <TableCell>
                                    <Checkbox
                                        checked={selected.includes(item.id)}
                                        onCheckedChange={() => handleSelect(item.id)}
                                    />
                                </TableCell>
                                {columns.map(column => (
                                    <TableCell key={String(column.key)}>
                                        {formatTableCell<T>(item[column.key])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            </div>
        </div>
    );
};
