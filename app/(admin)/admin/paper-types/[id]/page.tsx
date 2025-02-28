import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PaperTypesEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findPaperType = await prisma.paperType.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findPaperType) {
            await prisma.paperType.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    price: Number(formData.get("price"))
                }
            });
        }

        await prisma.paperType.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                price: Number(formData.get("price"))
            }
        });
        redirect("/admin/paper-types");
    };

    return (
        <div>
            <h1>{findPaperType?.id ? `Тип бумаги | ${findPaperType.id}` : `Новый тип бумаги | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <div className="flex gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findPaperType?.name} />
                    <Input name="price" type="number" placeholder="Цена за лист" defaultValue={findPaperType?.price} />
                    <Button type="submit">{findPaperType ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
