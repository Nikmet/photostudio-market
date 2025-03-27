//TODO: Картинки добавить

import { AddressPlaqueFormsForm } from "@/components/forms/address-plaque-forms-form/address-plaque-forms-form";
import { FormValuesAddressPlaqueForms } from "@/components/forms/address-plaque-forms-form/schema";
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
                    width: data.width
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
                width: data.width
            }
        });
        redirect("/admin/address-plaque-form");
    };

    return (
        <div>
            <h1>{findAPF?.id ? `Форма адресного аншлага | ${findAPF.id}` : `Новая форма адресного аншлага | ${id}`}</h1>
            {findAPF ? (
                <AddressPlaqueFormsForm
                    defaultValues={findAPF}
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
