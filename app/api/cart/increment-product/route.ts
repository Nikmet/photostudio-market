import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id } = await req.json();

    const newItem = await prisma.productItem.update({
        where: { id },
        data: { count: { increment: 1 } },
        include: { product: true }
    });

    await prisma.productItem.update({
        where: { id: newItem.id },
        data: {
            total: {
                increment: newItem.product.price
            }
        }
    });

    const item = await prisma.productItem.findFirst({
        where: { id },
        include: {
            cart: {
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
            }
        }
    });

    if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const totalAmount = item.cart.items.reduce((acc, item) => {
        return acc + item.product.price * item.count;
    }, 0);

    const cart = await prisma.cart.update({
        where: { id: item.cart.id },
        data: {
            totalAmount
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
}
