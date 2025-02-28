import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { PaperType } from "@prisma/client";
import React from "react";

export default async function PaperTypesPage() {
    const paperTypes = await prisma.paperType.findMany();

    const columns: IColumnsProps<PaperType>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Цена", key: "price" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.paperType.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список типов бумаги</h2>
            <AdminTable<PaperType>
                data={paperTypes}
                route="paper-types"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ТБУМ"
                has_actions={true}
            />
        </div>
    );
}
