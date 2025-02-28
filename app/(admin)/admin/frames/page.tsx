import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Frame } from "@prisma/client";
import React from "react";

export default async function FramesPage() {
    const frames = await prisma.frame.findMany();

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
        <div>
            <h2 className="text-2xl font-medium mb-10">Список рамок</h2>
            <AdminTable<Frame>
                data={frames}
                route="frames"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="РМ"
                has_actions={true}
            />
        </div>
    );
}
