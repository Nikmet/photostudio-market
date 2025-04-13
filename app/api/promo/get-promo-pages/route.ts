import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const promoPages = await prisma.promotionPage.findMany();

        if (!promoPages) {
            return NextResponse.json({ error: "No promo pages found" }, { status: 404 });
        }

        return NextResponse.json(promoPages);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
