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

    const findLFP = await prisma.lFP.findFirst({
        where: {
            id: id
        },
        include: {
            paper_type: true
        }
    });

    const paperTypes = await prisma.paperType.findMany();

    const handleSubmit = async (formData: FormData) => {
        "use server";

        const findPaperType = await prisma.paperType.findFirst({
            where: {
                id: formData.get("paper_type") as string
            }
        });

        if (!findLFP) {
            const lfps = await prisma.lFP.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    width: Number(formData.get("width")),
                    height: Number(formData.get("height")),
                    paper_type: {
                        connect: {
                            id: findPaperType?.id
                        }
                    }
                }
            });

            await createProduct(lfps.id, lfps.name, "Реклама", 450);
        }

        await prisma.lFP.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                width: Number(formData.get("width")),
                height: Number(formData.get("height")),
                paper_type: {
                    connect: {
                        id: findPaperType?.id
                    }
                }
            }
        });
        redirect("/admin/lfps");
    };

    return (
        <div>
            <h1>{findLFP?.id ? `Широкоформатная печать | ${findLFP.id}` : `Новая широкоформатная печать | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findLFP?.name} />
                    <Input name="height" type="number" placeholder="Высота" defaultValue={findLFP?.height} />
                    <Input name="width" type="number" placeholder="Ширина" defaultValue={findLFP?.width} />
                    <AdminSelect
                        name="paper_type"
                        placeholder={"Тип бумаги"}
                        items={{
                            ...Object.fromEntries(paperTypes.map(type => [type.id, type.name]))
                        }}
                        defaultValue={findLFP?.paper_type_id}
                    />
                    <Button type="submit">{findLFP ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
