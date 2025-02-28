import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { hexToRgb, rgbStringToHex } from "@/lib/colors";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function CupsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findColor = await prisma.color.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findColor) {
            await prisma.color.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    rgb: hexToRgb(formData.get("rgb") as string)
                }
            });
        }

        await prisma.color.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                rgb: hexToRgb(formData.get("rgb") as string)
            }
        });
        redirect("/admin/colors");
    };

    return (
        <div>
            <h1>{findColor?.id ? `Цвет | ${findColor.id}` : `Новый цвет | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <div className="flex gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findColor?.name} />
                    <Input
                        name="rgb"
                        type="color"
                        defaultValue={findColor?.rgb ? rgbStringToHex(findColor?.rgb) : "#000000"}
                    />
                    <Button type="submit">{findColor ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
