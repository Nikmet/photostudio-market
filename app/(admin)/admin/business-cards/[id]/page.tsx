import { createProduct, updateProduct, uploadImage } from "@/app/actions";
import { BusinessCardsForm } from "@/components/admin-forms/business-cards-form/business-cards-form";
import { FormValuesBusinessCards } from "@/components/admin-forms/business-cards-form/schema";
import { PageTitle } from "@/components/page-title";
import { getImage } from "@/lib/image";
import { calcBusinessCardPrice } from "@/lib/prices";
import { prisma } from "@/prisma/prisma-client";
import { PrintingSide } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function BusinessCardsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findCard = await prisma.businessCard.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesBusinessCards) => {
        "use server";

        if (!findCard) {
            const businessCard = await prisma.businessCard.create({
                data: {
                    id: id,
                    name: data.name,
                    printing_side: data.printing_side as PrintingSide,
                    printing_image: await uploadImage(data.printing_image)
                }
            });

            await createProduct(
                businessCard.id,
                businessCard.name,
                "Сувениры",
                await calcBusinessCardPrice(businessCard),
                "business-cards"
            );
        } else {
            const updatedBC = await prisma.businessCard.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    printing_side: data.printing_side as PrintingSide,
                    printing_image: await uploadImage(data.printing_image)
                }
            });
            await updateProduct(updatedBC.id, updatedBC.name, await calcBusinessCardPrice(updatedBC));
        }

        redirect("/admin/business-cards");
    };

    return (
        <div>
            <PageTitle>{findCard?.id ? `Визитка | ${findCard.id}` : `Новая визитка | ${id}`}</PageTitle>
            {findCard ? (
                <BusinessCardsForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        name: findCard?.name,
                        printing_side: findCard?.printing_side,
                        printing_image: await getImage(findCard.printing_image)
                    }}
                    href="/admin/business-cards"
                    id={id}
                />
            ) : (
                <BusinessCardsForm onSubmit={handleSubmit} href="/admin/business-cards" id={id} />
            )}
        </div>
    );
}
