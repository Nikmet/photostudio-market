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

    const findBaguette = await prisma.baguette.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findBaguette) {
            await prisma.baguette.create({
                data: {
                    id: id,
                    price: Number(formData.get("price")),
                    image: ""
                }
            });
        }

        await prisma.baguette.update({
            where: {
                id: id
            },
            data: {
                price: Number(formData.get("price"))
            }
        });
        redirect("/admin/baguettes");
    };

    return (
        <div>
            <h1>{findBaguette?.id ? `Багет | ${findBaguette.id}` : `Новый багет | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <div className="flex gap-2">
                    <Input name="price" type="number" placeholder="Цена за метр" defaultValue={findBaguette?.price} />
                    <Button type="submit">{findBaguette ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
