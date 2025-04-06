import { uploadImage } from "@/app/actions";
import { BaguetteForm } from "@/components/forms/baguette-form/baguette-form";
import { FormValuesBaguette } from "@/components/forms/baguette-form/schema";
import { PageTitle } from "@/components/page-title";
import { getImage } from "@/lib/image";
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
                    image: await uploadImage(data.image)
                }
            });
        } else {
            await prisma.baguette.update({
                where: {
                    id: id
                },
                data: {
                    price: data.price,
                    serial_number: data.serial_number,
                    image: await uploadImage(data.image)
                }
            });
        }

        redirect("/admin/baguettes");
    };

    return (
        <div>
            <PageTitle>{findBaguette?.id ? `Багет | ${findBaguette.id}` : `Новый багет | ${id}`}</PageTitle>
            {findBaguette ? (
                <BaguetteForm
                    defaultValues={{
                        price: findBaguette.price,
                        serial_number: findBaguette.serial_number,
                        image: await getImage(findBaguette.image)
                    }}
                    onSubmit={handleSubmit}
                    id={id}
                    href="/admin/baguettes"
                />
            ) : (
                <BaguetteForm onSubmit={handleSubmit} href="/admin/baguettes" id={id} />
            )}
        </div>
    );
}
