import { difficile } from "@/@types/enums";
import { createProduct } from "@/app/actions";
import { AdminSelect } from "@/components/admin-select";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { Difficile } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PrintingsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findlEC = await prisma.lEC.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findlEC) {
            const lec = await prisma.lEC.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    height: Number(formData.get("height")),
                    width: Number(formData.get("width")),
                    difficile: formData.get("difficile") as Difficile
                }
            });

            await createProduct(lec.id, lec.name, "Сувениры", 450);
        }

        await prisma.lEC.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                height: Number(formData.get("height")),
                width: Number(formData.get("width")),
                difficile: formData.get("difficile") as Difficile
            }
        });
        redirect("/admin/lec");
    };

    return (
        <div>
            <h1>{findlEC?.id ? `ЛГР | ${findlEC.id}` : `Новая ЛГР | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findlEC?.name} />
                    <Input name="height" type="number" placeholder="Высота" defaultValue={findlEC?.height} />
                    <Input name="width" type="number" placeholder="Ширина" defaultValue={findlEC?.width} />
                    <AdminSelect
                        name="difficile"
                        placeholder={"Сложность"}
                        items={difficile}
                        defaultValue={findlEC?.difficile}
                    />
                    <Button type="submit">{findlEC ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
