import { createProduct } from "@/app/actions";
import { AdminCheckbox } from "@/components/admin-checkbox";
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

export default async function FramesEditPage({ params }: Props) {
    const id = decodeURIComponent(params.id);

    const findFrame = await prisma.frame.findFirst({
        where: {
            id: id
        },
        include: {
            baguette: true
        }
    });

    const baguettes = await prisma.baguette.findMany();

    const handleSubmit = async (formData: FormData) => {
        "use server";

        const findBaguette = await prisma.baguette.findFirst({
            where: {
                id: formData.get("baguette") as string
            }
        });

        if (!findFrame) {
            const frame = await prisma.frame.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    width: Number(formData.get("width")),
                    height: Number(formData.get("height")),
                    has_glass: Boolean(formData.get("has_glass")),
                    has_backdrop: Boolean(formData.get("has_backdrop")),
                    has_suspension: Boolean(formData.get("has_suspension")),
                    baguette: {
                        connect: {
                            id: findBaguette?.id
                        }
                    }
                }
            });

            await createProduct(frame.id, frame.name, "Рамки", 450);
        }

        await prisma.frame.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                width: Number(formData.get("width")),
                height: Number(formData.get("height")),
                has_glass: Boolean(formData.get("has_glass")),
                has_backdrop: Boolean(formData.get("has_backdrop")),
                has_suspension: Boolean(formData.get("has_suspension")),
                baguette: {
                    connect: {
                        id: findBaguette?.id
                    }
                }
            }
        });
        redirect("/admin/frames");
    };

    return (
        <div>
            <h1>{findFrame?.id ? `Табличка | ${findFrame.id}` : `Новая табличка | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findFrame?.name} />
                    <Input name="height" type="number" placeholder="Высота" defaultValue={findFrame?.height} />
                    <Input name="width" type="number" placeholder="Ширина" defaultValue={findFrame?.width} />
                    <AdminCheckbox name="has_glass" label="Стекло" defaultChecked={findFrame?.has_glass} />
                    <AdminCheckbox name="has_backdrop" label="Задник" defaultChecked={findFrame?.has_backdrop} />
                    <AdminCheckbox name="has_suspension" label="Подвес" defaultChecked={findFrame?.has_suspension} />
                    <AdminSelect
                        name="baguette"
                        placeholder={"Багет"}
                        items={{
                            ...Object.fromEntries(baguettes.map(baguette => [baguette.id, baguette.id]))
                        }}
                        defaultValue={findFrame?.baguette.id}
                    />
                    <Button type="submit">{findFrame ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
