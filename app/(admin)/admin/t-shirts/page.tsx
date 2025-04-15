import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function TShirtsPage() {
    const t_shirts = await prisma.tShirt.findMany();

    const flattenedData = t_shirts.map(t_shirt => ({
        id: t_shirt.id,
        name: t_shirt.name,
        printingSide: t_shirt.printingSide,
        size: t_shirt.size,
        printing_image: t_shirt.printing_image
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Стороны печати", key: "printingSide" },
        { title: "Размер", key: "size" },
        { title: "Изображение", key: "printing_image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.tShirt.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список футболок</h2>
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="t-shirts"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="Ф"
                has_actions={true}
            />
        </div>
    );
}
