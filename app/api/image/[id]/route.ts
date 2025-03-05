import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const image = await prisma.image.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new NextResponse(image.data, {
        headers: {
            "Content-Type": image.mimeType
        }
    });
}
