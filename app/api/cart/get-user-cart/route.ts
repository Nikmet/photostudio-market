import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json();

        const user = await prisma.user.findFirst({
            where: {
                id
            },
            include: {
                cart: {
                    include: {
                        items: {
                            orderBy: {
                                createdAt: "asc"
                            },
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(user?.cart);
    } catch (e) {
        console.log(e);
    }
}
