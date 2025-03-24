import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
    const products = await prisma.product.findMany();

    return NextResponse.json(
        products.map(product => ({
            id: product.itemId,
            name: product.itemName
        }))
    );
}
