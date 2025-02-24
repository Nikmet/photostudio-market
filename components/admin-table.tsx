"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib";
import { Checkbox } from "./ui/checkbox";
import { useRouter } from "next/navigation";
import { Button } from "./ui";
import { createUid, getId } from "@/lib/uid";
import { formatTableCell } from "@/lib/format-table-cell";
import { usePagination } from "@/hooks/use-pagination";
import React from "react";
import { Pagination } from "./pagination";
import { TableSearch } from "./table-search";

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
    has_actions?: boolean;
}

export const AdminTable = <T extends { id: string }>({
    data,
    columns,
    route,
    handleDeleteProp,
    prefix,
    has_actions,
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

    const handleDelete = async (ids: string[]) => {
        handleDeleteProp?.(ids);
        setSelected([]);
        router.refresh();
    };

    const handleAdd = (id: string) => {
        const newId = (Number(getId(id)) + 1).toString();

        const uid = createUid(prefix ?? "", newId);
        router.push(`/admin/${route}/${uid}`);
    };

    return (
        <div className={cn("pr-5 flex flex-col min-h-[calc(100vh-200px)]", className)}>
            <div className="pr-5 flex flex-col min-h-[calc(100vh-200px)]">
                {!has_actions && <TableSearch<T> data={data} route={route} className="absolute top-4 right-10" />}
                {has_actions && (
                    <div className="flex justify-between mb-3">
                        <Button onClick={() => handleAdd(data[data.length - 1] ? data[data.length - 1].id : "К-00000")}>
                            Добавить
                        </Button>
                        <TableSearch<T> data={data} route={route} />
                        <div className="flex gap-2">
                            <Button className="bg-red-500" onClick={() => handleDelete(selected)}>
                                Удалить
                            </Button>
                            <Button className="bg-blue-500">
                                Редактировать <ArrowDown />
                            </Button>
                        </div>
                    </div>
                )}
                {data.length > 0 && (
                    <>
                        <Table className="overflow-x-auto min-w-[1200px]">
                            <TableHeader>
                                <TableRow>
                                    {has_actions && <TableHead></TableHead>}
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
                                        {has_actions && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={selected.includes(item.id)}
                                                    onCheckedChange={() => handleSelect(item.id)}
                                                />
                                            </TableCell>
                                        )}
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
                    </>
                )}
            </div>
        </div>
    );
};
