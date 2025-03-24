import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Чтение файла в виде ArrayBuffer
    const buffer = await file.arrayBuffer();
    const byteArray = new Uint8Array(buffer);

    // Сохранение в базу данных
    const image = await prisma.image.create({
        data: {
            fileName: file.name,
            mimeType: file.type,
            data: byteArray
        }
    });

    return NextResponse.json(image);
}
