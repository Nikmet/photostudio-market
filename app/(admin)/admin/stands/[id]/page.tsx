import { createProduct, updateProduct, uploadImage } from "@/app/actions";
import { FormValuesStands } from "@/components/admin-forms/stands-form/schema";
import { StandsForm } from "@/components/admin-forms/stands-form/stands-form";
import { PageTitle } from "@/components/page-title";
import { getImage } from "@/lib/image";
import { calcStandPrice } from "@/lib/prices";
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
                    pocket_count: data.pocket_count,
                    printing_image: await uploadImage(data.printing_image)
                }
            });

            await createProduct(stand.id, stand.name, "Реклама", await calcStandPrice(stand), "stands");
        } else {
            const updatedStand = await prisma.stand.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    width: data.width,
                    height: data.height,
                    pocket_count: data.pocket_count,
                    printing_image: await uploadImage(data.printing_image)
                }
            });
            await updateProduct(updatedStand.id, updatedStand.name, await calcStandPrice(updatedStand));
        }

        redirect("/admin/stands");
    };

    return (
        <div>
            <PageTitle>{findStand?.id ? `Стенд | ${findStand.id}` : `Новый стенд | ${id}`}</PageTitle>
            {findStand ? (
                <StandsForm
                    defaultValues={{
                        height: findStand.height,
                        width: findStand.width,
                        pocket_count: findStand.pocket_count,
                        name: findStand.name,
                        printing_image: await getImage(findStand.printing_image)
                    }}
                    onSubmit={handleSubmit}
                    href="/admin/stands"
                    id={id}
                />
            ) : (
                <StandsForm onSubmit={handleSubmit} href="/admin/stands" id={id} />
            )}
        </div>
    );
}
