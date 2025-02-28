import { density } from "@/@types/enums";
import { createProduct } from "@/app/actions";
import { AdminSelect } from "@/components/admin-select";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { BannerDensity } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function BannersEditPage({ params }: Props) {
    const id = decodeURIComponent(params.id);

    const findBanner = await prisma.banner.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (formData: FormData) => {
        "use server";

        if (!findBanner) {
            const banner = await prisma.banner.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    density: formData.get("density") as BannerDensity,
                    height: Number(formData.get("height")),
                    width: Number(formData.get("width")),
                    luvers_count: Number(formData.get("luvers_count")),
                    luvers_step: Number(formData.get("luvers_step"))
                }
            });

            await createProduct(banner.id, banner.name, "Реклама", 450);
        }

        await prisma.banner.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                density: formData.get("density") as BannerDensity,
                height: Number(formData.get("height")),
                width: Number(formData.get("width")),
                luvers_count: Number(formData.get("luvers_count")),
                luvers_step: Number(formData.get("luvers_step"))
            }
        });
        redirect("/admin/banners");
    };

    return (
        <div>
            <h1>{findBanner?.id ? `Банер | ${findBanner.id}` : `Новый банер | ${id}`}</h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findBanner?.name} />
                    <Input name="width" type="number" placeholder="Ширина" defaultValue={findBanner?.width} />
                    <Input name="height" type="number" placeholder="Высота" defaultValue={findBanner?.height} />
                    <Input
                        name="luvers_step"
                        type="number"
                        placeholder="Шаг люверсов"
                        defaultValue={findBanner?.luvers_step}
                    />
                    <Input
                        name="luvers_count"
                        type="number"
                        placeholder="Кол.-во люверсов"
                        value={20}
                        defaultValue={findBanner?.luvers_count}
                    />
                    <AdminSelect
                        name="density"
                        placeholder={"Плотность"}
                        items={density}
                        defaultValue={findBanner?.density}
                    />
                    <Button type="submit">{findBanner ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
