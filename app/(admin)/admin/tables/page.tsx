import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function TablesPage() {
    const tables = await prisma.table.findMany({
        include: {
            Color: true
        }
    });

    const flattenedTables = tables.map(table => ({
        id: table.id,
        name: table.name,
        width: table.width,
        height: table.height,
        color: table.Color.name
    }));

    const columns: IColumnsProps<(typeof flattenedTables)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Ширина", key: "width" },
        { title: "Высота", key: "height" },
        { title: "Цвет", key: "color" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.table.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список табличек</h2>
            <AdminTable<(typeof flattenedTables)[0]>
                data={flattenedTables}
                route="tables"
                className=""
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="Т"
                has_actions={true}
            />
        </div>
    );
}
