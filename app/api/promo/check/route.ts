import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: "Промокод не указан" }, { status: 400 });
        }

        const promoCode = await prisma.promoCode.findFirst({
            where: {
                code: code.trim()
            }
        });

        if (!promoCode) {
            return NextResponse.json({ error: "Промокод недействителен или истек срок действия" }, { status: 400 });
        }

        return NextResponse.json({
            discount: promoCode.discount,
            code: promoCode.code
        });
    } catch (error) {
        console.error("Error checking promo code:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
