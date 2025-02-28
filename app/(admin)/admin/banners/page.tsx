import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Banner } from "@prisma/client";
import React from "react";

export default async function BannersPage() {
    const banners = await prisma.banner.findMany();

    const columns: IColumnsProps<Banner>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Плотность", key: "density" },
        { title: "Ширина", key: "width" },
        { title: "Высота", key: "height" },
        { title: "Шаг люверсов (мм)", key: "luvers_step" },
        { title: "Кол.-во люверсов", key: "luvers_count" },
        { title: "Изображение", key: "printing_image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.banner.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-medium mb-10">Список банеров</h2>
            <AdminTable<Banner>
                data={banners}
                route="banners"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="БАН"
                has_actions={true}
            />
        </div>
    );
}
