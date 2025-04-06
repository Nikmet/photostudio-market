import { createProduct, updateProduct, uploadImage } from "@/app/actions";
import { FormValuesTShirts } from "@/components/forms/t-shirts-form/schema";
import { TShirtsForm } from "@/components/forms/t-shirts-form/t-shirts-form";
import { PageTitle } from "@/components/page-title";
import { getImage } from "@/lib/image";
import { calcTShirtPrice } from "@/lib/prices";
import { prisma } from "@/prisma/prisma-client";
import { PrintingSide, Size } from "@prisma/client";
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
        }
    });

    const handleSubmit = async (data: FormValuesTShirts) => {
        "use server";

        if (!find_t_shirts) {
            const t_shirt = await prisma.tShirt.create({
                data: {
                    id: id,
                    name: data.name,
                    printingSide: data.printingSide as PrintingSide,
                    size: data.size as Size,
                    printing_image: await uploadImage(data.printing_image)
                }
            });

            await createProduct(t_shirt.id, t_shirt.name, "Сувениры", await calcTShirtPrice(t_shirt), "t-shirts");
        } else {
            const updatedTShirt = await prisma.tShirt.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    printingSide: data.printingSide as PrintingSide,
                    size: data.size as Size,
                    printing_image: await uploadImage(data.printing_image)
                }
            });
            await updateProduct(updatedTShirt.id, updatedTShirt.name, await calcTShirtPrice(updatedTShirt));
        }
        redirect("/admin/t-shirts");
    };

    return (
        <div>
            <PageTitle>{find_t_shirts?.id ? `Футболка | ${find_t_shirts.id}` : `Новая футболка | ${id}`}</PageTitle>
            {find_t_shirts ? (
                <TShirtsForm
                    defaultValues={{
                        name: find_t_shirts.name,
                        printingSide: find_t_shirts.printingSide,
                        size: find_t_shirts.size,
                        printing_image: await getImage(find_t_shirts.printing_image)
                    }}
                    onSubmit={handleSubmit}
                />
            ) : (
                <TShirtsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
