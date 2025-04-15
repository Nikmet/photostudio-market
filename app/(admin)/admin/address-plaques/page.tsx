import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function AddressPlaquesPage() {
    const addressPlaque = await prisma.addressPlaque.findMany({
        include: {
            Color: true,
            form: true
        }
    });

    const flattenedAddressPlaques = addressPlaque.map(addressPlaque => ({
        id: addressPlaque.id,
        name: addressPlaque.name,
        color: addressPlaque.Color.name,
        form: addressPlaque.form.name,
        address: addressPlaque.address
    }));

    const columns: IColumnsProps<(typeof flattenedAddressPlaques)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Форма", key: "form" },
        { title: "Цвет", key: "color" },
        { title: "Адрес", key: "address" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.addressPlaque.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-medium mb-10">Список адресных аншлагов</h2>
            <AdminTable<(typeof flattenedAddressPlaques)[0]>
                data={flattenedAddressPlaques}
                route="address-plaques"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="АА"
                has_actions={true}
            />
        </div>
    );
}
