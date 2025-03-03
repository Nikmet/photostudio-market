import { createProduct } from "@/app/actions";
import { FramesForm } from "@/components/forms/frames-form/frames-form";
import { FormValuesFrames } from "@/components/forms/frames-form/schema";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function FramesEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findFrame = await prisma.frame.findFirst({
        where: {
            id: id
        },
        include: {
            baguette: true
        }
    });

    const baguettes = await prisma.baguette.findMany();

    const handleSubmit = async (data: FormValuesFrames) => {
        "use server";

        const findBaguette = await prisma.baguette.findFirst({
            where: {
                id: data.baguetteId
            }
        });

        if (!findFrame) {
            const frame = await prisma.frame.create({
                data: {
                    id: id,
                    name: data.name,
                    width: data.width,
                    height: data.height,
                    has_glass: data.has_glass,
                    has_backdrop: data.has_backdrop,
                    has_suspension: data.has_suspension,
                    baguette: {
                        connect: {
                            id: findBaguette?.id
                        }
                    }
                }
            });

            await createProduct(frame.id, frame.name, "Рамки", 450);
        }

        await prisma.frame.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                width: data.width,
                height: data.height,
                has_glass: data.has_glass,
                has_backdrop: data.has_backdrop,
                has_suspension: data.has_suspension,
                baguette: {
                    connect: {
                        id: findBaguette?.id
                    }
                }
            }
        });
        redirect("/admin/frames");
    };

    return (
        <div>
            <h1>{findFrame?.id ? `Табличка | ${findFrame.id}` : `Новая табличка | ${id}`}</h1>
            {findFrame ? (
                <FramesForm defaultValues={findFrame} onSubmit={handleSubmit} baguettes={baguettes} />
            ) : (
                <FramesForm onSubmit={handleSubmit} baguettes={baguettes} />
            )}
        </div>
    );
}
