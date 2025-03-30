import { createProduct, updateProduct } from "@/app/actions";
import { MagnetsForm } from "@/components/forms/magnets-form/magnets-form";
import { FormValuesMagnet } from "@/components/forms/magnets-form/schema";
import { PageTitle } from "@/components/page-title";
import { imageToFile } from "@/lib/image-to-file";
import { calcMagnetPrice } from "@/lib/prices";
import { uploadImage } from "@/lib/upload-image";
import { prisma } from "@/prisma/prisma-client";
import { Image, MagnetType } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function MagnetEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findMagnet = await prisma.magnet.findFirst({
        where: {
            id: id
        },
        include: {
            printing_image: true
        }
    });

    const handleSubmit = async (data: FormValuesMagnet) => {
        "use server";

        let printing_image: Image | undefined;

        // Загружаем изображение, если оно есть
        if (data.printing_image) {
            printing_image = await uploadImage(data.printing_image);
        }

        if (!findMagnet) {
            const magnet = await prisma.magnet.create({
                data: {
                    id: id,
                    name: data.name,
                    height: data.height,
                    width: data.width,
                    magnet_type: data.magnet_type as MagnetType,
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
                }
            });

            await createProduct(magnet.id, magnet.name, "Сувениры", await calcMagnetPrice(magnet), "magnets");
        } else {
            const updatedMagnet = await prisma.magnet.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    height: data.height,
                    width: data.width,
                    magnet_type: data.magnet_type as MagnetType,
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
                }
            });
            await updateProduct(id, updatedMagnet.name, await calcMagnetPrice(updatedMagnet));
        }

        redirect("/admin/magnets");
    };

    return (
        <div>
            <PageTitle>{findMagnet?.id ? `Магнит | ${findMagnet.id}` : `Новый магнит | ${id}`}</PageTitle>
            {findMagnet ? (
                <MagnetsForm
                    defaultValues={{
                        name: findMagnet.name,
                        height: findMagnet.height,
                        width: findMagnet.width,
                        magnet_type: findMagnet.magnet_type,
                        printing_image: imageToFile(findMagnet.printing_image)
                    }}
                    onSubmit={handleSubmit}
                />
            ) : (
                <MagnetsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
