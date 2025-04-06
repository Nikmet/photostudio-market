import { uploadImage } from "@/app/actions";
import { AddressPlaqueFormsForm } from "@/components/forms/address-plaque-forms-form/address-plaque-forms-form";
import { FormValuesAddressPlaqueForms } from "@/components/forms/address-plaque-forms-form/schema";
import { getImage } from "@/lib/image";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function AddressPlaqueFormsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findAPF = await prisma.addressPlaqueForm.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesAddressPlaqueForms) => {
        "use server";

        if (!findAPF) {
            await prisma.addressPlaqueForm.create({
                data: {
                    id: id,
                    name: data.name,
                    price: data.price,
                    height: data.height,
                    width: data.width,
                    image: await uploadImage(data.image)
                }
            });
        }

        await prisma.addressPlaqueForm.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                price: data.price,
                height: data.height,
                width: data.width,
                image: await uploadImage(data.image)
            }
        });
        redirect("/admin/address-plaque-form");
    };

    return (
        <div>
            <h1>{findAPF?.id ? `Форма адресного аншлага | ${findAPF.id}` : `Новая форма адресного аншлага | ${id}`}</h1>
            {findAPF ? (
                <AddressPlaqueFormsForm
                    defaultValues={{
                        ...findAPF,
                        image: await getImage(findAPF.image)
                    }}
                    onSubmit={handleSubmit}
                    id={id}
                    href="/admin/address-plaque-form"
                />
            ) : (
                <AddressPlaqueFormsForm onSubmit={handleSubmit} id={id} href="/admin/address-plaque-form" />
            )}
        </div>
    );
}
