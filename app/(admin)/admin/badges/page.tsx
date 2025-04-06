import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Badge } from "@prisma/client";
import React from "react";

export default async function BadgesPage() {
    const badges = await prisma.badge.findMany();

    const columns: IColumnsProps<Badge>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Изображение", key: "printing_image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.badge.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-medium mb-10">Список значков</h2>
            <AdminTable<Badge>
                data={badges}
                route="badges"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ЗН"
                has_actions={true}
            />
        </div>
    );
}
