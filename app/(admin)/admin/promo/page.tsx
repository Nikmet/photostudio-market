import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { PromotionPage } from "@prisma/client";
import React from "react";

export default async function CupPage() {
    const pages = await prisma.promotionPage.findMany();

    const columns: IColumnsProps<PromotionPage>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "title" },
        { title: "Изображение", key: "image" },
        { title: "Путь", key: "route" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.promotionPage.deleteMany({
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
            <AdminTable<PromotionPage>
                data={pages}
                route="promo"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ПС"
                has_actions={true}
            />
        </div>
    );
}
