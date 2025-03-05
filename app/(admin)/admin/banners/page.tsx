import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function BannersPage() {
    const banners = await prisma.banner.findMany({
        include: {
            printing_image: true
        }
    });

    const flattenedData = banners.map(banner => ({
        id: banner.id,
        name: banner.name,
        density: banner.density,
        width: banner.width,
        height: banner.height,
        luvers_step: banner.luvers_step,
        luvers_count: banner.luvers_count,
        printing_image: banner.printing_image
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
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
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="banners"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="БАН"
                has_actions={true}
            />
        </div>
    );
}
