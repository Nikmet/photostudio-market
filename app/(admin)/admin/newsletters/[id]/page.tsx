import { createProduct } from "@/app/actions";
import { AdminSelect } from "@/components/admin-select";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function TablesEditPage({ params }: Props) {
    const id = decodeURIComponent(params.id);

    const findNewsletter = await prisma.newsletter.findFirst({
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

        if (!findNewsletter) {
            const newsletter = await prisma.newsletter.create({
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

            await createProduct(newsletter.id, newsletter.name, "Реклама", 450);
        }

        await prisma.newsletter.update({
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
        redirect("/admin/newsletters");
    };

    return (
        <div>
            <h1>
                {findNewsletter?.id
                    ? `Информационная табличка | ${findNewsletter.id}`
                    : `Новая информационная табличка | ${id}`}
            </h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findNewsletter?.name} />
                    <Input name="height" type="number" placeholder="Высота" defaultValue={findNewsletter?.height} />
                    <Input name="width" type="number" placeholder="Ширина" defaultValue={findNewsletter?.width} />
                    <AdminSelect
                        name="color"
                        placeholder={"Цвет"}
                        items={{
                            ...Object.fromEntries(colors.map(color => [color.id, color.name]))
                        }}
                        defaultValue={findNewsletter?.Color.id}
                    />
                    <Button type="submit">{findNewsletter ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
