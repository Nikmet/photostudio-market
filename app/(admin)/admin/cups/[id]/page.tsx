import { createProduct, updateProduct } from "@/app/actions";
import { CupsForm } from "@/components/forms/cups-form/cups-form";
import { FormValuesCups } from "@/components/forms/cups-form/schema";
import { PageTitle } from "@/components/page-title";
import { imageToFile } from "@/lib/image-to-file";
import { calcCupPrice } from "@/lib/prices";
import { uploadImage } from "@/lib/upload-image";
import { prisma } from "@/prisma/prisma-client";
import { Image } from "@prisma/client";
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
        },
        include: {
            printing_image: true
        }
    });

    const handleSubmit = async (data: FormValuesCups) => {
        "use server";

        let printing_image: Image | undefined;

        // Загружаем изображение, если оно есть
        if (data.printing_image) {
            printing_image = await uploadImage(data.printing_image);
        }

        if (!findCup) {
            const cup = await prisma.cup.create({
                data: {
                    id: id,
                    name: data.name,
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
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
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
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
                        printing_image: imageToFile(findCup.printing_image)
                    }}
                />
            ) : (
                <CupsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
