"use client";

import { cn } from "@/lib";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { formatTableCell } from "@/lib/format-table-cell";
import { Pagination } from "./pagination";
import { usePagination } from "@/hooks/use-pagination";
import React from "react";
import { useSort } from "@/hooks/use-sort";
import { IColumnsProps } from "@/@types/column-props";
import { ArrowDown, ArrowUp } from "lucide-react";
import { IOrderProps } from "./forms/clients-form/client-form";
import { useTableActions } from "@/hooks/use-table-actions";

export interface IClientTableProps {
    className?: string;
    orders: IOrderProps[];
}

export const ClientTable = ({ orders, className }: IClientTableProps): React.JSX.Element => {
    const { sortConfig, handleSort } = useSort<IOrderProps>(orders);

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return orders;

        return [...orders].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof IOrderProps] as any;
            const bValue = b[sortConfig.key as keyof IOrderProps] as any;

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [orders, sortConfig]);

    const { currentItems: currentSortedItems, currentPage, totalPages, paginate } = usePagination(sortedData, 15);
    const { redirectToPage } = useTableActions<IOrderProps>(orders, "orders");

    const columns: IColumnsProps<IOrderProps>[] = [
        { title: "Номер", key: "id" },
        { title: "Дата", key: "createdAt" },
        { title: "Статус", key: "status" },
        { title: "Статус оплаты", key: "payment_status" },
        { title: "Сумма", key: "totalAmount" }
    ];

    return (
        <>
            <div className={cn(`pr-5 flex flex-col min-h-[calc(100vh-1000px)]`, className)}>
                <div className={`pr-5 flex flex-col min-h-[calc(100vh-1000px)]`}>
                    {orders.length > 0 && (
                        <>
                            <Table className="overflow-x-auto min-w-[1200px]">
                                <TableHeader>
                                    <TableRow>
                                        {columns.map(column => (
                                            <TableHead
                                                key={column.title}
                                                className="cursor-pointer"
                                                onClick={() => handleSort(column.key)}
                                            >
                                                <div
                                                    className={cn("flex items-center gap-2", {
                                                        "justify-end": column.key === "totalAmount"
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
                                    {currentSortedItems.map(item => {
                                        return (
                                            <TableRow
                                                key={item.id}
                                                className="cursor-pointer"
                                                onDoubleClick={() => redirectToPage(item.id)}
                                            >
                                                {columns.map(column => (
                                                    <TableCell
                                                        key={String(column.key)}
                                                        className={cn({
                                                            "text-right": column.key === "totalAmount"
                                                        })}
                                                    >
                                                        {formatTableCell<(typeof orders)[0]>(item[column.key])}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
