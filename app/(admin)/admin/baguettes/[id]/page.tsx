import { BaguetteForm } from "@/components/forms/baguette-form/baguette-form";
import { FormValuesBaguette } from "@/components/forms/baguette-form/schema";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PaperTypesEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findBaguette = await prisma.baguette.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesBaguette) => {
        "use server";

        if (!findBaguette) {
            await prisma.baguette.create({
                data: {
                    id: id,
                    price: data.price,
                    serial_number: data.serial_number,
                    image: ""
                }
            });
        }

        await prisma.baguette.update({
            where: {
                id: id
            },
            data: {
                price: data.price,
                serial_number: data.serial_number
            }
        });
        redirect("/admin/baguettes");
    };

    return (
        <div>
            <h1>{findBaguette?.id ? `Багет | ${findBaguette.id}` : `Новый багет | ${id}`}</h1>
            {findBaguette ? (
                <BaguetteForm defaultValues={findBaguette} onSubmit={handleSubmit} />
            ) : (
                <BaguetteForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
