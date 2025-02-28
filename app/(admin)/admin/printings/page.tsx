import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Printing } from "@prisma/client";
import React from "react";

export default async function PrintingsPage() {
    const printings = await prisma.printing.findMany();

    const columns: IColumnsProps<Printing>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Тип печати", key: "printing_type" }
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
            <h2 className="text-2xl font-medium mb-10">Список печатей</h2>
            <AdminTable<Printing>
                data={printings}
                route="printings"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="П"
                has_actions={true}
            />
        </div>
    );
}
