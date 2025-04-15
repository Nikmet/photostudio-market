import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Cup } from "@prisma/client";
import React from "react";

export default async function CupPage() {
    const cups = await prisma.cup.findMany();

    const columns: IColumnsProps<Cup>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Изображение", key: "printing_image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.cup.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список кружек</h2>
            <AdminTable<Cup>
                data={cups}
                route="cups"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="К"
                has_actions={true}
            />
        </div>
    );
}
