"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";
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
import { usePagesStore } from "@/store/pages-store";
import { IPage } from "@/@types/page";

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
    const [sortedData, setSortedData] = React.useState<T[]>(data);
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof T | null;
        direction: "asc" | "desc" | null;
    }>({
        key: null,
        direction: null
    });
    const { currentItems: currentSortedItems, currentPage, totalPages, paginate } = usePagination(sortedData, 15);
    const { addPage, setActivePage } = usePagesStore();
    const router = useRouter();

    React.useEffect(() => {
        setSortedData(data);
    }, [data]);

    const handleSort = (key: keyof T) => {
        let direction: "asc" | "desc" | null = "asc";

        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        } else if (sortConfig.key === key && sortConfig.direction === "desc") {
            direction = null;
        }

        setSortConfig({ key, direction });

        const sorted = [...sortedData].sort((a, b) => {
            if (direction === null) {
                return 0;
            }

            if (a[key] < b[key]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        setSortedData(direction === null ? data : sorted);
    };

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

    const redirectToPage = (id: string) => {
        const page: IPage = {
            href: `/admin/${route}/${id}`,
            name: id
        };
        router.push(page.href);
        addPage(page);
        setActivePage(page);
    };

    const handleAdd = () => {
        if (data.length === 0) {
            const uid = createUid(prefix ?? "", "1"); // Начинаем с 1, если массив пуст
            redirectToPage(uid);
            return;
        }

        const maxId = Math.max(...data.map(item => Number(getId(item.id))));
        const newId = (maxId + 1).toString();
        const uid = createUid(prefix ?? "", newId);
        redirectToPage(uid);
    };

    return (
        <div className={cn("pr-5 flex flex-col min-h-[calc(100vh-250px)]", className)}>
            <div className="pr-5 flex flex-col min-h-[calc(100vh-250px)]">
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
