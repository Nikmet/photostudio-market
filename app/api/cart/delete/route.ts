import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Validate request has body
        if (!req.body) {
            return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
        }

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Product item ID is required" }, { status: 400 });
        }

        // Find product item with necessary relations
        const productItem = await prisma.productItem.findUnique({
            where: { id },
            select: {
                id: true,
                productId: true,
                product: {
                    select: {
                        itemId: true
                    }
                },
                cartId: true
            }
        });

        if (!productItem) {
            return NextResponse.json({ error: "Product item not found" }, { status: 404 });
        }

        const itemId = productItem.product?.itemId;
        if (!itemId) {
            return NextResponse.json({ error: "Associated product has no itemId" }, { status: 400 });
        }

        const prefix = itemId.split("-")[0];
        console.log("Deleting product with prefix:", prefix, "and ID:", itemId);

        // Transaction for all delete operations
        const result = await prisma.$transaction(async tx => {
            // 1. First delete the product item
            await tx.productItem.delete({
                where: { id: productItem.id }
            });

            // 2. Delete specific product type based on prefix
            const deleteOperations: Record<string, () => Promise<any>> = {
                К: () => tx.cup.deleteMany({ where: { id: itemId } }),
                Ф: () => tx.tShirt.deleteMany({ where: { id: itemId } }),
                ЛГР: () => tx.lEC.deleteMany({ where: { id: itemId } }),
                ЗН: () => tx.badge.deleteMany({ where: { id: itemId } }),
                МГ: () => tx.magnet.deleteMany({ where: { id: itemId } }),
                П: () => tx.printing.deleteMany({ where: { id: itemId } }),
                БАН: () => tx.banner.deleteMany({ where: { id: itemId } }),
                СТ: () => tx.stand.deleteMany({ where: { id: itemId } }),
                Т: () => tx.table.deleteMany({ where: { id: itemId } }),
                АА: () => tx.addressPlaque.deleteMany({ where: { id: itemId } }),
                ИВ: () => tx.newsletter.deleteMany({ where: { id: itemId } }),
                ШФП: () => tx.lFP.deleteMany({ where: { id: itemId } }),
                В: () => tx.businessCard.deleteMany({ where: { id: itemId } }),
                РМ: () => tx.frame.deleteMany({ where: { id: itemId } })
            };

            if (prefix in deleteOperations) {
                await deleteOperations[prefix]();
            } else {
                console.warn(`No delete operation defined for prefix: ${prefix}`);
            }

            // 3. Finally delete the main product
            await tx.product.delete({
                where: { id: productItem.productId }
            });

            // Return updated cart
            return await tx.cart.findFirst({
                where: { id: productItem.cartId },
                include: {
                    items: {
                        orderBy: { createdAt: "asc" },
                        include: { product: true }
                    }
                }
            });
        });

        return NextResponse.json({ cart: result });
    } catch (error) {
        console.error("Error in DELETE operation:", error instanceof Error ? error.message : error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : null
            },
            { status: 500 }
        );
    }
}
