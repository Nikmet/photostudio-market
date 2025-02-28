import { createProduct } from "@/app/actions";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function TablesEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findStand = await prisma.stand.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findStand) {
            const stand = await prisma.stand.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    width: Number(formData.get("width")),
                    height: Number(formData.get("height")),
                    pocket_count: Number(formData.get("pocket_count"))
                }
            });

            await createProduct(stand.id, stand.name, "Реклама", 450);
        }

        await prisma.stand.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                width: Number(formData.get("width")),
                height: Number(formData.get("height")),
                pocket_count: Number(formData.get("pocket_count"))
            }
        });
        redirect("/admin/stands");
    };

    return (
        <div>
            <h1>{findStand?.id ? `Стенд | ${findStand.id}` : `Новый стенд | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findStand?.name} />
                    <Input name="height" type="number" placeholder="Высота" defaultValue={findStand?.height} />
                    <Input name="width" type="number" placeholder="Ширина" defaultValue={findStand?.width} />
                    <Input
                        name="pocket_count"
                        type="number"
                        placeholder="Количество карманов"
                        defaultValue={findStand?.pocket_count}
                    />

                    <Button type="submit">{findStand ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
