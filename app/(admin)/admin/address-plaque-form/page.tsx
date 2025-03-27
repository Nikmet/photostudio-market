import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function AddressPlaqueFormsPage() {
    const apf = await prisma.addressPlaqueForm.findMany({
        include: {
            image: true
        }
    });

    const flattenedData = apf.map(apf => ({
        id: apf.id,
        name: apf.name,
        width: apf.width,
        height: apf.height,
        price: apf.price,
        image: apf.image
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Ширина", key: "width" },
        { title: "Высота", key: "height" },
        { title: "Цена", key: "price" },
        { title: "Изображение", key: "image" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.addressPlaqueForm.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-medium mb-10">Список форм адресных аншлагов</h2>
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="address-plaque-form"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ФАА"
                has_actions={true}
            />
        </div>
    );
}
