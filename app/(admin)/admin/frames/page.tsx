"use client";

import { Button } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initial_frames } from "@/constants/frames";
import { cn } from "@/lib";
import { ArrowDown, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function FramesPage() {
    const [selected, setSelected] = React.useState<number[]>([]);
    const [frames, setFrames] = React.useState(initial_frames);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 15;
    const router = useRouter();

    const handleSelect = (id: number) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
        console.log(selected);
    };

    const handleDelete = () => {
        const updatedFrames = frames.filter(frame => !selected.includes(frame.id));
        console.log(updatedFrames);
        setFrames(updatedFrames);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = frames.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(frames.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список рамок</h2>
            <div className="pr-5 flex flex-col min-h-[calc(100vh-200px)]">
                <div className="flex justify-between mb-3">
                    <Button onClick={handleDelete}>Добавить</Button>
                    <div className="bg-gray-300 w-[500px] rounded-md flex items-center justify-between px-2 py-1">
                        Поиск
                        <Search />
                    </div>
                    <div className="flex gap-2">
                        <Button className="bg-red-500" onClick={handleDelete}>
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
                            <TableHead>Номер</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Багет</TableHead>
                            <TableHead>Размер</TableHead>
                            <TableHead>Стекло</TableHead>
                            <TableHead>Задник</TableHead>
                            <TableHead>Паспарту</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map(frame => (
                            <TableRow
                                key={frame.id}
                                className="cursor-pointer"
                                onDoubleClick={() => {
                                    router.push(`/admin/frames/${frame.id}`);
                                }}
                            >
                                <TableCell>
                                    <Checkbox
                                        onCheckedChange={() => handleSelect(frame.id)}
                                        checked={selected.includes(frame.id)}
                                    />
                                </TableCell>
                                <TableCell>{frame.id}</TableCell>
                                <TableCell>{frame.name}</TableCell>
                                <TableCell>{frame.baguette}</TableCell>
                                <TableCell>
                                    {frame.height} x {frame.width}
                                </TableCell>
                                <TableCell>{frame.has_glass ? "Да" : "Нет"}</TableCell>
                                <TableCell>{frame.has_backdrop ? "Да" : "Нет"}</TableCell>
                                <TableCell>{frame.has_suspension ? "Да" : "Нет"}</TableCell>
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
}
