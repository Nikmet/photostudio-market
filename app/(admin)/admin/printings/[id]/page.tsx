import { printingTypes } from "@/@types/enums";
import { createProduct } from "@/app/actions";
import { AdminSelect } from "@/components/admin-select";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { PrintingType } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PrintingsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findPrinting = await prisma.printing.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findPrinting) {
            const printing = await prisma.printing.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    printing_type: formData.get("printing_type") as PrintingType
                }
            });

            await createProduct(printing.id, printing.name, "Сувениры", 450);
        }

        await prisma.printing.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                printing_type: formData.get("printing_type") as PrintingType
            }
        });
        redirect("/admin/printings");
    };

    return (
        <div>
            <h1>{findPrinting?.id ? `Печать | ${findPrinting.id}` : `Новая печать | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findPrinting?.name} />
                    <AdminSelect
                        name="printing_type"
                        placeholder={"Тип печати"}
                        items={printingTypes}
                        defaultValue={findPrinting?.printing_type}
                    />
                    <Button type="submit">{findPrinting ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
