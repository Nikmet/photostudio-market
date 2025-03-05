import { createProduct } from "@/app/actions";
import { BusinessCardsForm } from "@/components/forms/business-cards-form/business-cards-form";
import { FormValuesBusinessCards } from "@/components/forms/business-cards-form/schema";
import { PageTitle } from "@/components/page-title";
import { imageToFile } from "@/lib/image-to-file";
import { calcBusinessCardPrice } from "@/lib/prices";
import { uploadImage } from "@/lib/upload-image";
import { prisma } from "@/prisma/prisma-client";
import { Image, PrintingSide } from "@prisma/client";
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
        },
        include: {
            printing_image: true
        }
    });

    const handleSubmit = async (data: FormValuesBusinessCards) => {
        "use server";

        let printing_image: Image | undefined;

        // Загружаем изображение, если оно есть
        if (data.printing_image) {
            printing_image = await uploadImage(data.printing_image);
        }

        if (!findCard) {
            const businessCard = await prisma.businessCard.create({
                data: {
                    id: id,
                    name: data.name,
                    printing_side: data.printing_side as PrintingSide,
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
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
                printing_side: data.printing_side as PrintingSide,
                printing_image: printing_image
                    ? {
                          connect: {
                              id: printing_image.id
                          }
                      }
                    : undefined
            }
        });
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
                        printing_image: imageToFile(findCard.printing_image)
                    }}
                />
            ) : (
                <BusinessCardsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
