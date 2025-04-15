import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function BusinessCardsPage() {
    const cards = await prisma.businessCard.findMany();

    const flattenedData = cards.map(card => ({
        id: card.id,
        name: card.name,
        printing_side: card.printing_side,
        printing_image: card.printing_image
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Стороны печати", key: "printing_side" },
        { title: "Изображение", key: "printing_image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.businessCard.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список визиток</h2>
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="business-cards"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="В"
                has_actions={true}
            />
        </div>
    );
}
