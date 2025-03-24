"use client";

import { Product } from "@prisma/client";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useSort } from "@/hooks/use-sort";
import { IColumnsProps } from "@/@types/column-props";
import { cn } from "@/lib";
import { usePagination } from "@/hooks/use-pagination";
import { formatTableCell } from "@/lib/format-table-cell";
import { Pagination } from "./pagination";
import { Button } from "./ui/button";

export interface ISelectedWindowProps {
    className?: string;
    products: Product[];
    onClose: () => void;
    action: (product: Product) => void;
}

export const SelectedProductWindow = ({
    products,
    action,
    className,
    onClose
}: ISelectedWindowProps): React.JSX.Element => {
    const { sortedData, sortConfig, handleSort } = useSort<Product>(products);
    const { currentItems: currentSortedItems, currentPage, totalPages, paginate } = usePagination(sortedData, 14);

    const columns: IColumnsProps<Product>[] = [
        { title: "Номер", key: "id" },
        { title: "Номер продукта", key: "itemId" },
        { title: "Название продукта", key: "itemName" },
        { title: "Цена", key: "price" }
    ];

    return (
        <div className={cn("fixed left-0 top-0 bg-black/20 w-full h-full p-10 z-50", className)}>
            <div className="bg-background h-full p-10 rounded-md relative">
                {/* Кнопка закрытия */}
                <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>

                <h3 className="text-2xl font-medium mb-4">Выберите продукт</h3>
                <Table className="overflow-x-auto min-w-[1200px]">
                    <TableHeader>
                        <TableRow>
                            {columns.map(column => (
                                <TableHead
                                    key={column.title}
                                    className="cursor-pointer text-md font-medium"
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
                            <TableRow key={item.id} className="cursor-pointer" onDoubleClick={() => action(item)}>
                                {columns.map(column => (
                                    <TableCell
                                        key={String(column.key)}
                                        className={cn({ "text-right": column.key === "price" })}
                                    >
                                        {formatTableCell<Product>(item[column.key as keyof Product])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} className="mt-6" />
            </div>
        </div>
    );
};
