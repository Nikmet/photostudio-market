"use client";

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
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
import { EmptyTable } from "./empty-table";

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
    total?: string;
    rows_count?: number;
    margin?: number;
}

export const AdminTable = <T extends { id: string }>({
    data,
    columns,
    route,
    handleDeleteProp,
    prefix,
    has_actions,
    total,
    rows_count,
    margin,
    className
}: IAdminTableProps<T>): React.JSX.Element => {
    const [tableData, setTableData] = React.useState<T[]>(data);
    const { sortedData, sortConfig, handleSort } = useSort<T>(tableData);
    const { selected, handleSelect, clearSelection } = useSelection();
    const { handleAdd, redirectToPage } = useTableActions<T>(tableData, route, prefix);
    const {
        currentItems: currentSortedItems,
        currentPage,
        totalPages,
        paginate
    } = usePagination(sortedData, rows_count ?? 15);

    React.useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleDelete = async (ids: string[]) => {
        await handleDeleteProp?.(ids);
        setTableData(prev => prev.filter(item => !ids.includes(item.id)));
        clearSelection();
    };

    if (tableData.length === 0) {
        return <EmptyTable text="Список пустой, добавьте первую запись" textButton="Добавить" action={handleAdd} />;
    }

    return (
        <div className={cn(`pr-5 flex flex-col min-h-[calc(100vh-${margin ?? 290}px)]`, className)}>
            <div className={`pr-5 flex flex-col min-h-[calc(100vh-${margin ?? 290}px)]`}>
                {has_actions && (
                    <div className="flex justify-between mb-3">
                        <Button onClick={handleAdd}>Добавить</Button>
                        <TableSearch<T> data={tableData} route={route} />
                        <div className="flex gap-2">
                            <Button className="bg-red-500" onClick={() => handleDelete(selected)}>
                                Удалить
                            </Button>
                        </div>
                    </div>
                )}
                {tableData.length > 0 && (
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
                                            <div
                                                className={cn("flex items-center gap-2", {
                                                    "justify-end": column.key === "price"
                                                })}
                                            >
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
                                            <TableCell
                                                key={String(column.key)}
                                                className={cn({ "text-right": column.key === "price" })}
                                            >
                                                {formatTableCell<T>(item[column.key])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                            {total && (
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={columns.length - 1}>Итого:</TableCell>
                                        <TableCell className="text-right">{total} ₽</TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    </>
                )}
            </div>
        </div>
    );
};
