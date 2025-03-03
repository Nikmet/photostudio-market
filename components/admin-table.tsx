"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui";
import { formatTableCell } from "@/lib/format-table-cell";
import { usePagination } from "@/hooks/use-pagination";
import React from "react";
import { Pagination } from "./pagination";
import { TableSearch } from "./table-search";
import { useSort } from "@/hooks/use-sort";
import { useSelection } from "@/hooks/use-selection";
import { useTableActions } from "@/hooks/use-table-actions";

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
    const { sortedData, sortConfig, handleSort } = useSort<T>(data);
    const { selected, handleSelect, clearSelection } = useSelection();
    const { handleAdd, redirectToPage } = useTableActions<T>(data, route, prefix);
    const { currentItems: currentSortedItems, currentPage, totalPages, paginate } = usePagination(sortedData, 15);

    const handleDelete = async (ids: string[]) => {
        handleDeleteProp?.(ids);
        clearSelection();
    };

    return (
        <div className={cn("pr-5 flex flex-col min-h-[calc(100vh-290px)]", className)}>
            <div className="pr-5 flex flex-col min-h-[calc(100vh-290px)]">
                {!has_actions && <TableSearch<T> data={data} route={route} className="absolute top-[65px] right-10" />}
                {has_actions && (
                    <div className="flex justify-between mb-3">
                        <Button onClick={handleAdd}>Добавить</Button>
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
                                        <TableHead
                                            key={column.title}
                                            className="cursor-pointer"
                                            onClick={() => handleSort(column.key)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {column.title}
                                                {sortConfig.key === column.key &&
                                                    (sortConfig.direction === "asc" ? (
                                                        <ArrowUp size={14} />
                                                    ) : (
                                                        <ArrowDown size={14} />
                                                    ))}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentSortedItems.map(item => (
                                    <TableRow
                                        key={item.id}
                                        className="cursor-pointer"
                                        onDoubleClick={() => {
                                            redirectToPage(item.id);
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
