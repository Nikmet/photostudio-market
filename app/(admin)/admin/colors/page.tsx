import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Color } from "@prisma/client";
import React from "react";

export default async function FramesPage() {
    const badges = await prisma.color.findMany();

    const columns: IColumnsProps<Color>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "RGB", key: "rgb" }
    ];



    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.color.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    };

    return (
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список цветов</h2>
            <AdminTable<Color>
                data={badges}
                route="colors"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ЦВ"
                has_actions={true}
            />
        </div>
    );
}
