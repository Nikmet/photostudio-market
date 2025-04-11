import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { code, phone } = await request.json();
        if (!code || !phone) {
            return NextResponse.json({ message: "Код и номер телефона обязательны" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                phone: phone
            }
        });

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
        }

        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                userId: user.id
            }
        });

        if (!verificationCode) {
            return NextResponse.json({ message: "Код не найден" }, { status: 404 });
        }

        if (verificationCode.code !== code) {
            return NextResponse.json({ message: "Код неверный" }, { status: 400 });
        }
        await prisma.verificationCode.delete({
            where: {
                id: verificationCode.id
            }
        });
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                verified: new Date()
            }
        });
        await prisma.verificationCode.deleteMany({
            where: {
                userId: user.id
            }
        });
        return NextResponse.json({ message: "Аккаунт подтвержден" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Внутренняя ошибка сервера: ${error}` }, { status: 500 });
    }
}
