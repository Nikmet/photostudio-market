import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";
import React from "react";

export default async function ClientsPage() {
    const clients = await prisma.user.findMany({
        where: {
            role: "USER"
        }
    });

    const flattenedData = clients.map(client => ({
        id: client.id,
        fullName: client.fullName,
        phone: client.phone,
        email: client.email
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "ФИО", key: "fullName" },
        { title: "Телефон", key: "phone" },
        { title: "Эл. Почта", key: "email" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.user.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
        redirect("/admin/clients");
    };

    return (
        <div>
            <h2 className="text-2xl font-medium mb-10">Список клиентов</h2>
            <AdminTable<(typeof flattenedData)[0]>
                data={flattenedData}
                route="clients"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="КЛ"
                has_actions={true}
            />
        </div>
    );
}
