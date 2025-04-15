import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function NewslettersPage() {
    const newsletters = await prisma.newsletter.findMany({
        include: {
            Color: true
        }
    });

    const flattenedNewsletters = newsletters.map(newsletter => ({
        id: newsletter.id,
        name: newsletter.name,
        width: newsletter.width,
        height: newsletter.height,
        color: newsletter.Color.name
    }));

    const columns: IColumnsProps<(typeof flattenedNewsletters)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Ширина", key: "width" },
        { title: "Высота", key: "height" },
        { title: "Цвет", key: "color" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.newsletter.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Список информационных вывесок</h2>
            <AdminTable<(typeof flattenedNewsletters)[0]>
                data={flattenedNewsletters}
                route="newsletters"
                className=""
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ИВ"
                has_actions={true}
            />
        </div>
    );
}
