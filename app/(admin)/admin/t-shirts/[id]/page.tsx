import { createProduct } from "@/app/actions";
import { ImageInput } from "@/components/image-input";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prisma } from "@/prisma/prisma-client";
import { PrintingSide, Size } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function TShirtsEditPage({ params }: Props) {
    const id = decodeURIComponent(params.id);

    const find_t_shirts = await prisma.tShirt.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!find_t_shirts) {
            const t_shirt = await prisma.tShirt.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    printingSide: formData.get("printing_side") as PrintingSide,
                    size: formData.get("size") as Size
                }
            });

            await createProduct(t_shirt.id, t_shirt.name, "Сувениры", 450);
        }

        await prisma.tShirt.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                printingSide: formData.get("printing_side") as PrintingSide,
                size: formData.get("size") as Size
            }
        });
        redirect("/admin/t-shirts");
    };

    return (
        <div>
            <h1>{find_t_shirts?.id ? `Футболка | ${find_t_shirts.id}` : `Новая футболка | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <div className="flex gap-2">
                    <ImageInput name="image" />
                    <div className="flex flex-col gap-2">
                        <Input name="name" type="text" placeholder="Название" defaultValue={find_t_shirts?.name} />
                        <Select name="printing_side" defaultValue={find_t_shirts?.printingSide}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Стороны печати" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ONE_SIDE">Односторонняя</SelectItem>
                                <SelectItem value="TWO_SIDES">Двусторонняя</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select name="size" defaultValue={find_t_shirts?.size}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Размер" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(Size).map(size => (
                                    <SelectItem key={size} value={size}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="submit">{find_t_shirts ? "Сохранить" : "Создать"}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
