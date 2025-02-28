import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function AddressPlaqueFormsEditPage({ params }: Props) {
    const id = decodeURIComponent(params.id);

    const findAPF = await prisma.addressPlaqueForm.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findAPF) {
            await prisma.addressPlaqueForm.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    image: ""
                }
            });
        }

        await prisma.addressPlaqueForm.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                image: ""
            }
        });
        redirect("/admin/address-plaque-form");
    };

    return (
        <div>
            <h1>{findAPF?.id ? `Форма адресного аншлага | ${findAPF.id}` : `Новая форма адресного аншлага | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findAPF?.name} />
                    <Button type="submit">{findAPF ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
