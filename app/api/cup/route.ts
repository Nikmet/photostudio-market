import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cups = await prisma.cup.findMany();

        if (!cups) {
            throw new Error("Кружки не найдены");
        }

        return NextResponse.json(cups, { status: 200 });
    } catch (e) {
        console.log("[API_CUP_ALL]", e);
        return NextResponse.json({ error: "Не удалось получить список кружек" }, { status: 500 });
    }
}
