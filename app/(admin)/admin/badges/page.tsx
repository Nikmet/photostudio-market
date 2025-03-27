import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function BadgesPage() {
    const badges = await prisma.badge.findMany({
        include: {
            printing_image: true
        }
    });

    const flattenedData = badges.map(badge => ({
        id: badge.id,
        name: badge.name,
        printing_image: badge.printing_image
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
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
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="badges"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ЗН"
                has_actions={true}
            />
        </div>
    );
}
