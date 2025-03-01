import { createProduct } from "@/app/actions";
import { AdminSelect } from "@/components/admin-select";
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

    const findTable = await prisma.table.findFirst({
        where: {
            id: id
        },
        include: {
            Color: true
        }
    });

    const colors = await prisma.color.findMany();

    const handleSubmit = async (formData: FormData) => {
        "use server";

        const findColor = await prisma.color.findFirst({
            where: {
                id: formData.get("color") as string
            }
        });

        if (!findTable) {
            const table = await prisma.table.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    width: Number(formData.get("width")),
                    height: Number(formData.get("height")),
                    Color: {
                        connect: {
                            id: findColor?.id
                        }
                    }
                }
            });

            await createProduct(table.id, table.name, "Реклама", 450);
        }

        await prisma.table.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                width: Number(formData.get("width")),
                height: Number(formData.get("height")),
                Color: {
                    connect: {
                        id: findColor?.id
                    }
                }
            }
        });
        redirect("/admin/tables");
    };

    return (
        <div>
            <h1>{findTable?.id ? `Табличка | ${findTable.id}` : `Новая табличка | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findTable?.name} />
                    <Input name="height" type="number" placeholder="Высота" defaultValue={findTable?.height} />
                    <Input name="width" type="number" placeholder="Ширина" defaultValue={findTable?.width} />
                    <AdminSelect
                        name="color"
                        route="colors"
                        placeholder={"Цвет"}
                        items={{
                            ...Object.fromEntries(colors.map(color => [color.id, color.name]))
                        }}
                        defaultValue={findTable?.Color.id}
                    />
                    <Button type="submit">{findTable ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
