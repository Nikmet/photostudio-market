import { prisma } from "@/prisma/prisma-client";
import { randomInt } from "crypto";
import { NextRequest, NextResponse } from "next/server";

async function sendSMS(phone: string, code: string): Promise<boolean> {
    try {
        const newPhone = phone.replace(/\D/g, "");

        const smsRuUrl = `https://sms.ru/sms/send?api_id=${
            process.env.SMS_API_KEY
        }&to=${newPhone}&msg=${encodeURIComponent(`Ваш код подтверждения: ${code}`)}&json=1`;

        const response = await fetch(smsRuUrl);
        const data = await response.json();

        return data.status === "OK";
    } catch (error) {
        console.error("SMS sending error:", error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json({ message: "Номер телефона обязателен" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                phone: phone
            }
        });

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
        }

        const code = randomInt(100000, 999999).toString();

        await prisma.verificationCode.deleteMany({
            where: {
                userId: user.id
            }
        });

        await prisma.verificationCode.create({
            data: {
                code,
                userId: user.id
            }
        });

        // Отправляем SMS
        const smsSent = await sendSMS(phone, code);

        if (!smsSent) {
            return NextResponse.json({ message: "Не удалось отправить SMS" }, { status: 500 });
        }

        return NextResponse.json({ message: "Код отправлен" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Внутренняя ошибка сервера: ${error}` }, { status: 500 });
    }
}
