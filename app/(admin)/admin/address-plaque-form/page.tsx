import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { AddressPlaqueForm } from "@prisma/client";
import React from "react";

export default async function AddressPlaqueFormsPage() {
    const apf = await prisma.addressPlaqueForm.findMany();

    const columns: IColumnsProps<AddressPlaqueForm>[] = [
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
            <AdminTable<AddressPlaqueForm>
                data={apf}
                route="address-plaque-form"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ФАА"
                has_actions={true}
            />
        </div>
    );
}
