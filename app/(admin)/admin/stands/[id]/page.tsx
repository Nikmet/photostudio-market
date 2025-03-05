import { createProduct } from "@/app/actions";
import { FormValuesStands } from "@/components/forms/stands-form/schema";
import { StandsForm } from "@/components/forms/stands-form/stands-form";
import { PageTitle } from "@/components/page-title";
import { imageToFile } from "@/lib/image-to-file";
import { calcStandPrice } from "@/lib/prices";
import { uploadImage } from "@/lib/upload-image";
import { prisma } from "@/prisma/prisma-client";
import { Image } from "@prisma/client";
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
        },
        include: {
            printing_image: true
        }
    });

    const handleSubmit = async (data: FormValuesStands) => {
        "use server";

        let printing_image: Image | undefined;

        // Загружаем изображение, если оно есть
        if (data.printing_image) {
            printing_image = await uploadImage(data.printing_image);
        }

        if (!findStand) {
            const stand = await prisma.stand.create({
                data: {
                    id: id,
                    name: data.name,
                    width: data.width,
                    height: data.height,
                    pocket_count: data.pocket_count,
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
                }
            });

            await createProduct(stand.id, stand.name, "Реклама", await calcStandPrice(stand), "stands");
        }

        await prisma.stand.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                width: data.width,
                height: data.height,
                pocket_count: data.pocket_count,
                printing_image: printing_image
                    ? {
                          connect: {
                              id: printing_image.id
                          }
                      }
                    : undefined
            }
        });
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
                        printing_image: imageToFile(findStand.printing_image)
                    }}
                    onSubmit={handleSubmit}
                />
            ) : (
                <StandsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
