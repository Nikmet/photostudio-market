import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { Magnet } from "@prisma/client";
import React from "react";

interface IColumnsProps {
    title: string;
    key: keyof Magnet;
}

export default async function TShirtsPage() {
    const t_shirts = await prisma.magnet.findMany();

    const columns: IColumnsProps[] = [
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
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список магнитов</h2>
            <AdminTable<Magnet>
                data={t_shirts}
                route="magnets"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="МГ"
                has_actions={true}
            />
        </div>
    );
}
