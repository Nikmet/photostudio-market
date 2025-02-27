import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Stand } from "@prisma/client";
import React from "react";

export default async function TablesPage() {
    const stands = await prisma.stand.findMany();

    const columns: IColumnsProps<Stand>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Ширина", key: "width" },
        { title: "Высота", key: "height" },
        { title: "Количество карманов", key: "pocket_count" }
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
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список стендов</h2>
            <AdminTable<Stand>
                data={stands}
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
