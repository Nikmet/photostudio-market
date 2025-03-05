import { createProduct } from "@/app/actions";
import { FormValuesTShirts } from "@/components/forms/t-shirts-form/schema";
import { TShirtsForm } from "@/components/forms/t-shirts-form/t-shirts-form";
import { imageToFile } from "@/lib/image-to-file";
import { calcTShirtPrice } from "@/lib/prices";
import { uploadImage } from "@/lib/upload-image";
import { prisma } from "@/prisma/prisma-client";
import { Image, PrintingSide, Size } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function TShirtsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const find_t_shirts = await prisma.tShirt.findFirst({
        where: {
            id: id
        },
        include: {
            printing_image: true
        }
    });

    const handleSubmit = async (data: FormValuesTShirts) => {
        "use server";

        let printing_image: Image | undefined;

        // Загружаем изображение, если оно есть
        if (data.printing_image) {
            printing_image = await uploadImage(data.printing_image);
        }

        if (!find_t_shirts) {
            const t_shirt = await prisma.tShirt.create({
                data: {
                    id: id,
                    name: data.name,
                    printingSide: data.printingSide as PrintingSide,
                    size: data.size as Size,
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
                }
            });

            await createProduct(t_shirt.id, t_shirt.name, "Сувениры", await calcTShirtPrice(t_shirt), "t-shirts");
        } else {
            await prisma.tShirt.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    printingSide: data.printingSide as PrintingSide,
                    size: data.size as Size,
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
                }
            });
        }
        redirect("/admin/t-shirts");
    };

    return (
        <div>
            <h1>{find_t_shirts?.id ? `Футболка | ${find_t_shirts.id}` : `Новая футболка | ${id}`}</h1>
            {find_t_shirts ? (
                <TShirtsForm
                    defaultValues={{
                        name: find_t_shirts.name,
                        printingSide: find_t_shirts.printingSide,
                        size: find_t_shirts.size,
                        printing_image: imageToFile(find_t_shirts.printing_image)
                    }}
                    onSubmit={handleSubmit}
                />
            ) : (
                <TShirtsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
