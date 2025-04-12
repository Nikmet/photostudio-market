import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json();

        const item = await prisma.productItem.delete({
            where: { id }
        });

        const cart = await prisma.cart.findFirst({
            where: {
                id: item.cartId
            },
            include: {
                items: {
                    orderBy: {
                        createdAt: "asc"
                    },
                    include: {
                        product: true
                    }
                }
            }
        });

        return NextResponse.json({ cart });
    } catch (e) {
        console.log(e);
    }
}
