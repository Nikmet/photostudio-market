import { BaguetteForm } from "@/components/forms/baguette-form/baguette-form";
import { FormValuesBaguette } from "@/components/forms/baguette-form/schema";
import { PageTitle } from "@/components/page-title";
import { imageToFile } from "@/lib/image-to-file";
import { uploadImage } from "@/lib/upload-image";
import { prisma } from "@/prisma/prisma-client";
import { Image } from "@prisma/client";
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
        },
        include: {
            image: true
        }
    });

    const handleSubmit = async (data: FormValuesBaguette) => {
        "use server";

        let image: Image | undefined;

        // Загружаем изображение, если оно есть
        if (data.image) {
            image = await uploadImage(data.image);
        }

        if (!findBaguette) {
            await prisma.baguette.create({
                data: {
                    id: id,
                    price: data.price,
                    serial_number: data.serial_number,
                    image: image
                        ? {
                              connect: {
                                  id: image.id
                              }
                          }
                        : undefined
                }
            });
        }

        await prisma.baguette.update({
            where: {
                id: id
            },
            data: {
                price: data.price,
                serial_number: data.serial_number,
                image: image
                    ? {
                          connect: {
                              id: image.id
                          }
                      }
                    : undefined
            }
        });
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
                        image: imageToFile(findBaguette.image)
                    }}
                    onSubmit={handleSubmit}
                />
            ) : (
                <BaguetteForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
