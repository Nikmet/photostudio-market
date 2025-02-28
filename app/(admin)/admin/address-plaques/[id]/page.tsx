import { createProduct } from "@/app/actions";
import { AdminSelect } from "@/components/admin-select";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function FramesEditPage({ params }: Props) {
    const id = decodeURIComponent(params.id);

    const findAddressPlaque = await prisma.addressPlaque.findFirst({
        where: {
            id: id
        },
        include: {
            Color: true,
            form: true
        }
    });

    const colors = await prisma.color.findMany();
    const forms = await prisma.addressPlaqueForm.findMany();

    const handleSubmit = async (formData: FormData) => {
        "use server";

        const findColor = await prisma.color.findFirst({
            where: {
                id: formData.get("color") as string
            }
        });

        const findForm = await prisma.addressPlaqueForm.findFirst({
            where: {
                id: formData.get("form") as string
            }
        });

        if (!findAddressPlaque) {
            const addressPlaque = await prisma.addressPlaque.create({
                data: {
                    id: id,
                    name: formData.get("name") as string,
                    address: formData.get("address") as string,
                    Color: {
                        connect: {
                            id: findColor?.id
                        }
                    },
                    form: {
                        connect: {
                            id: findForm?.id
                        }
                    }
                }
            });

            await createProduct(addressPlaque.id, addressPlaque.name, "Реклама", 450);
        }

        await prisma.addressPlaque.update({
            where: {
                id: id
            },
            data: {
                name: formData.get("name") as string,
                address: formData.get("address") as string,
                Color: {
                    connect: {
                        id: findColor?.id
                    }
                },
                form: {
                    connect: {
                        id: findForm?.id
                    }
                }
            }
        });
        redirect("/admin/address-plaques");
    };

    return (
        <div>
            <h1>
                {findAddressPlaque?.id ? `Адресный аншлаг | ${findAddressPlaque.id}` : `Новый адресный аншлаг | ${id}`}
            </h1>
            <form action={handleSubmit} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Input name="name" type="text" placeholder="Название" defaultValue={findAddressPlaque?.name} />
                    <Input name="address" type="text" placeholder="Адрес" defaultValue={findAddressPlaque?.address} />
                    <AdminSelect
                        name="color"
                        placeholder={"Цвет"}
                        items={{
                            ...Object.fromEntries(colors.map(color => [color.id, color.name]))
                        }}
                        defaultValue={findAddressPlaque?.colorId}
                    />
                    <AdminSelect
                        name="form"
                        placeholder={"Форма"}
                        items={{
                            ...Object.fromEntries(forms.map(form => [form.id, form.name]))
                        }}
                        defaultValue={findAddressPlaque?.formId}
                    />
                    <Button type="submit">{findAddressPlaque ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
}
