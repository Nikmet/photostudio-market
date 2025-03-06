import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: resolvedId } = await params;
    const id = Number(decodeURIComponent(resolvedId));

    const image = await prisma.image.findUnique({
        where: { id }
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
