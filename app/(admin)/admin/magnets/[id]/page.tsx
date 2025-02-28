import { magnetTypes } from "@/@types/enums";
import { createProduct } from "@/app/actions";
import { AdminSelect } from "@/components/admin-select";
import { ImageInput } from "@/components/image-input";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
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

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findMagnet) {
            const magnet = await prisma.magnet.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    height: Number(formData.get("height")),
                    width: Number(formData.get("width")),
                    magnet_type: formData.get("magnet_type") as MagnetType
                }
            });

            await createProduct(magnet.id, magnet.name, "Сувениры", 450);
        }

        await prisma.magnet.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                height: Number(formData.get("height")),
                width: Number(formData.get("width")),
                magnet_type: formData.get("magnet_type") as MagnetType
            }
        });
        redirect("/admin/magnets");
    };

    return (
        <div>
            <h1>{findMagnet?.id ? `Магнит | ${findMagnet.id}` : `Новый магнит | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <div className="flex gap-2">
                    <ImageInput name="image" />
                    <div className="flex flex-col gap-2">
                        <Input name="name" type="text" placeholder="Название" defaultValue={findMagnet?.name} />
                        <Input name="height" type="number" placeholder="Высота" defaultValue={findMagnet?.height} />
                        <Input name="width" type="number" placeholder="Ширина" defaultValue={findMagnet?.width} />
                        <AdminSelect
                            items={magnetTypes}
                            name="magnet_type"
                            placeholder="Тип магнита"
                            defaultValue={findMagnet?.magnet_type}
                        />
                        <Button type="submit">{findMagnet ? "Сохранить" : "Создать"}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
