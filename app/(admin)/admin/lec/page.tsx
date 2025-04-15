import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { LEC } from "@prisma/client";
import React from "react";

export default async function LECPage() {
    const lecs = await prisma.lEC.findMany();

    const columns: IColumnsProps<LEC>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Ширина", key: "width" },
        { title: "Высота", key: "height" },
        { title: "Сложность", key: "difficile" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.lEC.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список лазерной гравировки и резки</h2>
            <AdminTable<LEC>
                data={lecs}
                route="lec"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ЛГР"
                has_actions={true}
            />
        </div>
    );
}
