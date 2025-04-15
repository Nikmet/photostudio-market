"use client";

import { User } from "@prisma/client";
import { ArrowDown, ArrowUp, X } from "lucide-react"; // Добавлен иконка X
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useSort } from "@/hooks/use-sort";
import { IColumnsProps } from "@/@types/column-props";
import { cn } from "@/lib";
import { usePagination } from "@/hooks/use-pagination";
import { formatTableCell } from "@/lib/format-table-cell";
import { Pagination } from "./pagination";
import { Button } from "../ui/button"; // Добавлен компонент Button

export interface ISelectedWindowProps {
    className?: string;
    users: User[];
    onClose: () => void;
    action: (product: User) => void;
}

export const SelectedUserWindow = ({ users, action, className, onClose }: ISelectedWindowProps): React.JSX.Element => {
    const { sortedData, sortConfig, handleSort } = useSort<User>(users);
    const { currentItems: currentSortedItems, currentPage, totalPages, paginate } = usePagination(sortedData, 14);

    const columns: IColumnsProps<User>[] = [
        { title: "Номер", key: "id" },
        { title: "ФИО", key: "fullName" },
        { title: "Телефон", key: "phone" }
    ];

    return (
        <div className={cn("fixed left-0 top-0 bg-black/20 w-full h-full p-10 z-50", className)}>
            <div className="bg-background h-full p-10 relative">
                {" "}
                {/* Добавлен relative для позиционирования кнопки */}
                {/* Кнопка закрытия */}
                <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
                <h3 className="text-2xl font-medium mb-4">Выберите клиента</h3>
                <Table className="overflow-x-auto min-w-[1200px]">
                    <TableHeader>
                        <TableRow>
                            {columns.map(column => (
                                <TableHead
                                    key={column.title}
                                    className="cursor-pointer text-md font-medium"
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
                            <TableRow key={item.id} className="cursor-pointer" onDoubleClick={() => action(item)}>
                                {columns.map(column => (
                                    <TableCell key={String(column.key)}>
                                        {formatTableCell<User>(item[column.key as keyof User])}
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
