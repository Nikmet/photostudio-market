import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function CupPage() {
    const cups = await prisma.cup.findMany({
        include: {
            printing_image: true
        }
    });

    const flattenedData = cups.map(cup => ({
        id: cup.id,
        name: cup.name,
        printing_image: cup.printing_image
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
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
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="cups"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="К"
                has_actions={true}
            />
        </div>
    );
}
