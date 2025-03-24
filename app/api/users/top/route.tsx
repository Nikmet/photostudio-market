import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
    const topClients = await prisma.user.findMany({
        where: {
            role: "USER"
        },
        select: {
            id: true,
            fullName: true,
            orders: {
                where: {
                    payment_status: "SUCCEEDED"
                },
                select: {
                    totalAmount: true
                }
            }
        },
        orderBy: {
            orders: {
                _count: "desc"
            }
        },
        take: 5
    });

    const formattedClients = topClients
        .map(client => ({
            ...client,
            totalSpent: client.orders.reduce((sum, order) => sum + order.totalAmount, 0)
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent);

    return NextResponse.json(formattedClients);
}
