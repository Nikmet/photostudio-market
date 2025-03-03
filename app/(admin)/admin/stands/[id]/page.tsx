import { createProduct } from "@/app/actions";
import { FormValuesStands } from "@/components/forms/stands-form/schema";
import { StandsForm } from "@/components/forms/stands-form/stands-form";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function StandsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findStand = await prisma.stand.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesStands) => {
        "use server";

        if (!findStand) {
            const stand = await prisma.stand.create({
                data: {
                    id: id,
                    name: data.name,
                    width: data.width,
                    height: data.height,
                    pocket_count: data.pocket_count
                }
            });

            await createProduct(stand.id, stand.name, "Реклама", 450);
        }

        await prisma.stand.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                width: data.width,
                height: data.height,
                pocket_count: data.pocket_count
            }
        });
        redirect("/admin/stands");
    };

    return (
        <div>
            <h1>{findStand?.id ? `Стенд | ${findStand.id}` : `Новый стенд | ${id}`}</h1>
            {findStand ? (
                <StandsForm defaultValues={findStand} onSubmit={handleSubmit} />
            ) : (
                <StandsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
