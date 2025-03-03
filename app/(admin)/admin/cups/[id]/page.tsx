import { createProduct } from "@/app/actions";
import { CupsForm } from "@/components/forms/cups-form/cups-form";
import { FormValuesCups } from "@/components/forms/cups-form/schema";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function CupsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findCup = await prisma.cup.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesCups) => {
        "use server";

        if (!findCup) {
            const cup = await prisma.cup.create({
                data: {
                    id: id,
                    name: data.name
                }
            });

            await createProduct(cup.id, cup.name, "Сувениры", 450);
        }

        await prisma.cup.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            }
        });
        redirect("/admin/cups");
    };

    return (
        <div>
            <h1>{findCup?.id ? `Кружка | ${findCup.id}` : `Новая кружка | ${id}`}</h1>

            {findCup ? (
                <CupsForm onSubmit={handleSubmit} defaultValues={findCup} />
            ) : (
                <CupsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
