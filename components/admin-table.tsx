"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowDown, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib";
import { Checkbox } from "./ui/checkbox";
import { useRouter } from "next/navigation";
import { Button } from "./ui";

export interface IAdminTableProps<T> {
    className?: string;
    data: T[];
    columns: {
        title: string;
        key: keyof T;
    }[];
    route: string;
    handleDeleteProp?: (ids: string[]) => void;
}

//TODO: ВЫнести пагинацию в отдельный компонент
//TODO: Сделать отображение для булева и налов

export const AdminTable = <T,>({
    data,
    columns,
    route,
    handleDeleteProp,
    className
}: IAdminTableProps<T>): React.JSX.Element => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 15;

    const router = useRouter();

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSelect = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
        console.log(selected);
    };

    const handleDelete = (ids: string[]) => {
        //TODO: Добавить тостер и диалоговое окно
        handleDeleteProp?.(ids);
    };

    return (
        <div className={cn("pr-5 flex flex-col min-h-[calc(100vh-200px)]", className)}>
            <div className="pr-5 flex flex-col min-h-[calc(100vh-200px)]">
                <div className="flex justify-between mb-3">
                    <Button>Добавить</Button>
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
                                key={String((item as any).id)}
                                className="cursor-pointer"
                                onDoubleClick={() => {
                                    router.push(`/admin/${route}/${(item as any).id}`);
                                }}
                            >
                                <TableCell>
                                    <Checkbox
                                        checked={selected.includes(String((item as any).id))}
                                        onCheckedChange={() => handleSelect(String((item as any).id))}
                                    />
                                </TableCell>
                                {columns.map(column => (
                                    <TableCell key={String(column.key)}>{String(item[column.key])}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-between gap-4 mt-auto pt-4">
                    <a onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} className="cursor-pointer">
                        <ArrowLeft
                            className={cn("w-6 h-6", {
                                "pointer-events-none text-gray-400": currentPage === 1
                            })}
                        />
                    </a>
                    <div className="flex gap-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <a
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={cn(
                                    "underline cursor-pointer",
                                    currentPage === i + 1 ? "text-blue-500" : " text-gray-700"
                                )}
                            >
                                {i + 1}
                            </a>
                        ))}
                    </div>

                    <a
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        className="cursor-pointer"
                    >
                        <ArrowRight
                            className={cn("w-6 h-6", {
                                "pointer-events-none text-gray-400": currentPage == totalPages
                            })}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};
