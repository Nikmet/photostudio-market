import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { PromoCode } from "@prisma/client";
import React from "react";

export default async function PromoCodesPage() {
    const codes = await prisma.promoCode.findMany();

    const columns: IColumnsProps<PromoCode>[] = [
        { title: "Номер", key: "id" },
        { title: "Промокод", key: "code" },
        { title: "Скидка", key: "discount" }
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
            <AdminTable<PromoCode>
                data={codes}
                route="promo-codes"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ПК"
                has_actions={true}
            />
        </div>
    );
}
