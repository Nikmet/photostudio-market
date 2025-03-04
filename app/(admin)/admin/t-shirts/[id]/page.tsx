import { createProduct } from "@/app/actions";
import { FormValuesTShirts } from "@/components/forms/t-shirts-form/schema";
import { TShirtsForm } from "@/components/forms/t-shirts-form/t-shirts-form";
import { calcTShirtPrice } from "@/lib/prices";
import { prisma } from "@/prisma/prisma-client";
import { PrintingSide, Size } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function TShirtsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const find_t_shirts = await prisma.tShirt.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesTShirts) => {
        "use server";

        if (!find_t_shirts) {
            const t_shirt = await prisma.tShirt.create({
                data: {
                    id: id,
                    name: data.name,
                    printingSide: data.printingSide as PrintingSide,
                    size: data.size as Size
                }
            });

            await createProduct(t_shirt.id, t_shirt.name, "Сувениры", await calcTShirtPrice(t_shirt), "t-shirts");
        }

        await prisma.tShirt.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                printingSide: data.printingSide as PrintingSide,
                size: data.size as Size
            }
        });
        redirect("/admin/t-shirts");
    };

    return (
        <div>
            <h1>{find_t_shirts?.id ? `Футболка | ${find_t_shirts.id}` : `Новая футболка | ${id}`}</h1>
            {find_t_shirts ? (
                <TShirtsForm defaultValues={find_t_shirts} onSubmit={handleSubmit} />
            ) : (
                <TShirtsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
