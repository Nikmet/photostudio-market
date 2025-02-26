import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { BusinessCard } from "@prisma/client";
import React from "react";

interface IColumnsProps {
    title: string;
    key: keyof BusinessCard;
}

export default async function BusinessCardsPage() {
    const cards = await prisma.businessCard.findMany();

    const columns: IColumnsProps[] = [
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
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список визиток</h2>
            <AdminTable<BusinessCard>
                data={cards}
                route="business-cards"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="В"
                has_actions={true}
            />
        </div>
    );
}
