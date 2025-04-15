import { createProduct, updateProduct, uploadImage } from "@/app/actions";
import { CupsForm } from "@/components/admin-forms/cups-form/cups-form";
import { FormValuesCups } from "@/components/admin-forms/cups-form/schema";
import { PageTitle } from "@/components/page-title";
import { getImage } from "@/lib/image";
import { calcCupPrice } from "@/lib/prices";
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
                    name: data.name,
                    printing_image: await uploadImage(data.printing_image)
                }
            });

            await createProduct(cup.id, cup.name, "Сувениры", await calcCupPrice(), "cups");
        } else {
            const updatedCup = await prisma.cup.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    printing_image: await uploadImage(data.printing_image)
                }
            });

            await updateProduct(updatedCup.id, updatedCup.name, await calcCupPrice());
        }

        redirect("/admin/cups");
    };

    return (
        <div>
            <PageTitle>{findCup?.id ? `Кружка | ${findCup.id}` : `Новая кружка | ${id}`}</PageTitle>

            {findCup ? (
                <CupsForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        name: findCup.name,
                        printing_image: await getImage(findCup.printing_image)
                    }}
                />
            ) : (
                <CupsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
