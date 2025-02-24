import { createProduct } from "@/app/actions";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function CupsEditPage({ params }: Props) {
    const id = decodeURIComponent(params.id);

    const findCup = await prisma.cup.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findCup) {
            const cup = await prisma.cup.create({
                data: {
                    id: id,
                    name: formData.get("name") as string
                }
            });

            await createProduct(cup.id, cup.name, "Сувениры", 450);
        }

        await prisma.cup.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string
            }
        });
        redirect("/admin/cups");
    };

    return (
        <div>
            <h1>{findCup?.id ? `Кружка | ${findCup.id}` : `Новая кружка | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findCup?.name} />
                    <Button type="submit">Сохранить</Button>
                </div>
            </form>
        </div>
    );
}
