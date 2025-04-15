import { IColumnsProps } from "@/@types/column-props";
import { deleteProducts } from "@/app/actions";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";
import React from "react";

export default async function OrderPage() {
    const getOrders = async () => {
        try {
            return await prisma.order.findMany({
                include: {
                    user: true
                }
            });
        } catch (e) {
            console.error(e);
            return undefined;
        }
    };

    const orders = await getOrders();

    if (!orders) {
        return (
            <>
                <h2 className="text-2xl font-medium mb-10">Заказы</h2>
                <div>Заказы не найдены</div>
            </>
        );
    }

    const flattenedTables = orders.map(order => ({
        id: order.id,
        date: order.createdAt.toLocaleDateString(),
        userName: order.user.fullName,
        status: order.status,
        payment_status: order.payment_status,
        totalAmount: order.totalAmount
    }));

    const columns: IColumnsProps<(typeof flattenedTables)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Дата", key: "date" },
        { title: "Пользователь", key: "userName" },
        { title: "Статус", key: "status" },
        { title: "Статус оплаты", key: "payment_status" },
        { title: "Сумма", key: "totalAmount" }
    ];

    const handleDelete = async (ids: string[]) => {
        "use server";

        await prisma.order.deleteMany({
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
            <h2 className="text-2xl font-medium mb-10">Заказы</h2>
            <AdminTable<(typeof flattenedTables)[0]>
                data={flattenedTables}
                route="orders"
                columns={columns}
                handleDeleteProp={handleDelete}
                prefix="ЗАК"
                has_actions={true}
            />
        </div>
    );
}
