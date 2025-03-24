import { prisma } from "@/prisma/prisma-client";

export async function GET() {
    const orders = await prisma.order.findMany({
        where: {
            payment_status: "SUCCEEDED"
        }
    });

    return Response.json(
        orders.map(order => ({
            id: order.id,
            date: order.createdAt.toISOString(),
            totalAmount: order.totalAmount,
            status: order.status
        }))
    );
}
