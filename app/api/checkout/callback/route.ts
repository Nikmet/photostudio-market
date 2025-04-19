import { PaymentCallbackData } from "@/@types/yookassa";
import { prisma } from "@/prisma/prisma-client";
import { OrderPaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as PaymentCallbackData;

        const order = await prisma.order.findFirst({
            where: {
                id: body.object.metadata.order_id
            }
        });

        if (!order) {
            console.log("Order not found");
            return new NextResponse("Order not found");
        }

        const isSucceeded = body.object.status === "succeeded";
        console.log(body.object.status);

        console.log(isSucceeded);

        await prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                payment_status: isSucceeded ? OrderPaymentStatus.SUCCEEDED : OrderPaymentStatus.CANCELED
            }
        });
    } catch (e) {
        console.log(e);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
