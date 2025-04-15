import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Baguette } from "@prisma/client";
import React from "react";

export default async function PaperTypesPage() {
    const baguettes = await prisma.baguette.findMany();

    const columns: IColumnsProps<Baguette>[] = [
        { title: "Номер", key: "id" },
        { title: "Серийный номер", key: "serial_number" },
        { title: "Цена", key: "price" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.baguette.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список багета</h2>
            <AdminTable<Baguette>
                data={baguettes}
                route="baguettes"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="БАГ"
                has_actions={true}
            />
        </div>
    );
}
