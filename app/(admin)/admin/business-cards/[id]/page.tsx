import { createProduct } from "@/app/actions";
import { ImageInput } from "@/components/image-input";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prisma } from "@/prisma/prisma-client";
import { PrintingSide } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function BusinessCardsEditPage({ params }: Props) {
    const id = decodeURIComponent(params.id);

    const findCard = await prisma.businessCard.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findCard) {
            const cup = await prisma.businessCard.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    printing_side: formData.get("printing_side") as PrintingSide
                }
            });

            await createProduct(cup.id, cup.name, "Сувениры", 450);
        }

        await prisma.businessCard.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                printing_side: formData.get("printing_side") as PrintingSide
            }
        });
        redirect("/admin/business-cards");
    };

    return (
        <div>
            <h1>{findCard?.id ? `Визитка | ${findCard.id}` : `Новая визитка | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <div className="flex gap-2">
                    <ImageInput name="image" />
                    <div className="flex flex-col gap-2">
                        <Input name="name" type="text" placeholder="Название" defaultValue={findCard?.name} />
                        <Select name="printing_side" defaultValue={findCard?.printing_side}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Стороны печати" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ONE_SIDE">Односторонняя</SelectItem>
                                <SelectItem value="TWO_SIDES">Двусторонняя</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit">{findCard ? "Сохранить" : "Создать"}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
