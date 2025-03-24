import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export const isRegistered = async (email: string) => {
    const findUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    return findUser != null;
};

export async function GET(request: Request, { params }: { params: { email: string } }) {
    const email = decodeURIComponent(params.email);

    if (!email) {
        return NextResponse.json(false);
    }
    return NextResponse.json(await isRegistered(email));
}
