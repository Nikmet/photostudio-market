import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { initial_frames } from "@/constants/frames";
import { prisma } from "@/prisma/prisma-client";
import { Frame } from "@prisma/client";
import React from "react";

export default function FramesPage() {
    const columns: IColumnsProps<Frame>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Высота", key: "height" },
        { title: "Ширина", key: "width" },
        { title: "Багет", key: "baguetteId" },
        { title: "Стекло", key: "has_glass" },
        { title: "Задник", key: "has_backdrop" },
        { title: "Подвес", key: "has_suspension" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.frame.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    };

    return (
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список рамок</h2>
            <AdminTable<Frame> data={initial_frames} route="frames" columns={columns} handleDeleteProp={handleDelete} prefix="РМ" />
        </div>
    );
}
