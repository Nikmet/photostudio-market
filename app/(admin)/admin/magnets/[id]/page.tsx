import { createProduct, updateProduct, uploadImage } from "@/app/actions";
import { MagnetsForm } from "@/components/admin-forms/magnets-form/magnets-form";
import { FormValuesMagnet } from "@/components/admin-forms/magnets-form/schema";
import { PageTitle } from "@/components/page-title";
import { getImage } from "@/lib/image";
import { calcMagnetPrice } from "@/lib/prices";
import { prisma } from "@/prisma/prisma-client";
import { MagnetType } from "@prisma/client";
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
        }
    });

    const handleSubmit = async (data: FormValuesMagnet) => {
        "use server";

        if (!findMagnet) {
            const magnet = await prisma.magnet.create({
                data: {
                    id: id,
                    name: data.name,
                    height: data.height,
                    width: data.width,
                    magnet_type: data.magnet_type as MagnetType,
                    printing_image: await uploadImage(data.printing_image)
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
                    printing_image: await uploadImage(data.printing_image)
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
                        printing_image: await getImage(findMagnet.printing_image)
                    }}
                    onSubmit={handleSubmit}
                />
            ) : (
                <MagnetsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
