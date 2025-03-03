import { createProduct } from "@/app/actions";
import { MagnetsForm } from "@/components/forms/magnets-form/magnets-form";
import { FormValuesMagnet } from "@/components/forms/magnets-form/schema";
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
                    magnet_type: data.magnet_type as MagnetType
                }
            });

            await createProduct(magnet.id, magnet.name, "Сувениры", 450);
        }

        await prisma.magnet.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                height: data.height,
                width: data.width,
                magnet_type: data.magnet_type as MagnetType
            }
        });
        redirect("/admin/magnets");
    };

    return (
        <div>
            <h1>{findMagnet?.id ? `Магнит | ${findMagnet.id}` : `Новый магнит | ${id}`}</h1>
            {findMagnet ? (
                <MagnetsForm defaultValues={findMagnet} onSubmit={handleSubmit} />
            ) : (
                <MagnetsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
