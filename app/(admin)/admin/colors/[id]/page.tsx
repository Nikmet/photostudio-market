import { ColorsForm } from "@/components/admin-forms/colors-form/colors-form";
import { FormValuesColors } from "@/components/admin-forms/colors-form/schema";
import { hexToRgb, rgbStringToHex } from "@/lib/colors";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function ColorsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findColor = await prisma.color.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesColors) => {
        "use server";

        if (!findColor) {
            await prisma.color.create({
                data: {
                    id: id,
                    name: data.name,
                    rgb: hexToRgb(data.rgb) as string,
                    price: data.price
                }
            });
        }

        await prisma.color.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                rgb: hexToRgb(data.rgb) as string,
                price: data.price
            }
        });
        redirect("/admin/colors");
    };

    return (
        <div>
            <h1>{findColor?.id ? `Цвет | ${findColor.id}` : `Новый цвет | ${id}`}</h1>
            {findColor ? (
                <ColorsForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        name: findColor.name || "",
                        rgb: rgbStringToHex(findColor?.rgb || "0,0,0"),
                        price: findColor.price || 0
                    }}
                    href="/admin/colors"
                    id={id}
                />
            ) : (
                <ColorsForm onSubmit={handleSubmit} href="/admin/colors" id={id} />
            )}
        </div>
    );
}
