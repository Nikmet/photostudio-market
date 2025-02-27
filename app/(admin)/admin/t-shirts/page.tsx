import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { TShirt } from "@prisma/client";
import React from "react";

interface IColumnsProps {
    title: string;
    key: keyof TShirt;
}

export default async function TShirtsPage() {
    const t_shirts = await prisma.tShirt.findMany();

    const columns: IColumnsProps[] = [
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
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список футболок</h2>
            <AdminTable<TShirt>
                data={t_shirts}
                route="t-shirts"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="Ф"
                has_actions={true}
            />
        </div>
    );
}
