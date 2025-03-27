import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

async function isRegistered(email: string) {
    const findUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    return findUser != null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
    const email = decodeURIComponent((await params).email);

    if (!email) {
        return NextResponse.json(false);
    }
    return NextResponse.json(await isRegistered(email));
}
