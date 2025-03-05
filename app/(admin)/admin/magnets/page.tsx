import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function TShirtsPage() {
    const t_shirts = await prisma.magnet.findMany({
        include: {
            printing_image: true
        }
    });

    const flattenedData = t_shirts.map(t_shirt => ({
        id: t_shirt.id,
        name: t_shirt.name,
        height: t_shirt.height,
        width: t_shirt.width,
        magnet_type: t_shirt.magnet_type,
        printing_image: t_shirt.printing_image
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Высота", key: "height" },
        { title: "Ширина", key: "width" },
        { title: "Тип магнита", key: "magnet_type" },
        { title: "Изображение", key: "printing_image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.magnet.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список магнитов</h2>
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="magnets"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="МГ"
                has_actions={true}
            />
        </div>
    );
}
