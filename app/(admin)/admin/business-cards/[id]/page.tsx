import { createProduct } from "@/app/actions";
import { BusinessCardsForm } from "@/components/forms/business-cards-form/business-cards-form";
import { FormValuesBusinessCards } from "@/components/forms/business-cards-form/schema";
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
                    printing_side: data.printing_side as PrintingSide
                }
            });

            await createProduct(
                businessCard.id,
                businessCard.name,
                "Сувениры",
                await calcBusinessCardPrice(businessCard),
                "business-cards"
            );
        }

        await prisma.businessCard.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                printing_side: data.printing_side as PrintingSide
            }
        });
        redirect("/admin/business-cards");
    };

    return (
        <div>
            <h1>{findCard?.id ? `Визитка | ${findCard.id}` : `Новая визитка | ${id}`}</h1>
            {findCard ? (
                <BusinessCardsForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        name: findCard?.name,
                        printing_side: findCard?.printing_side
                    }}
                />
            ) : (
                <BusinessCardsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
