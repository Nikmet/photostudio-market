import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function TablesPage() {
    const stands = await prisma.stand.findMany({
        include: {
            printing_image: true
        }
    });

    const flattenedData = stands.map(stand => ({
        id: stand.id,
        name: stand.name,
        width: stand.width,
        height: stand.height,
        pocket_count: stand.pocket_count,
        printing_image: stand.printing_image
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Ширина", key: "width" },
        { title: "Высота", key: "height" },
        { title: "Количество карманов", key: "pocket_count" },
        { title: "Изображение", key: "printing_image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.stand.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
        deleteProducts(ids);
    };

    return (
        <div>
            <h2 className="text-2xl font-medium mb-10">Список стендов</h2>
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="stands"
                className=""
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="СТ"
                has_actions={true}
            />
        </div>
    );
}
