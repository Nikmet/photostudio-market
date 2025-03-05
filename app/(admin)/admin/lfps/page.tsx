import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function TablesPage() {
    const lfps = await prisma.lFP.findMany({
        include: {
            paper_type: true,
            printing_image: true
        }
    });

    const flattenedTables = lfps.map(lfp => ({
        id: lfp.id,
        name: lfp.name,
        width: lfp.width,
        height: lfp.height,
        paper_type: lfp.paper_type.name,
        printing_image: lfp.printing_image
    }));

    const columns: IColumnsProps<(typeof flattenedTables)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Ширина", key: "width" },
        { title: "Высота", key: "height" },
        { title: "Тип бумаги", key: "paper_type" },
        { title: "Изображение", key: "printing_image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.lFP.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список широкоформатной печати</h2>
            <AdminTable<(typeof flattenedTables)[0]>
                data={flattenedTables}
                route="lfps"
                className=""
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ШФП"
                has_actions={true}
            />
        </div>
    );
}
