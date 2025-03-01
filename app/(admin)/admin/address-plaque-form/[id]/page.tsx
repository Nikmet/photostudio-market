import {
    AddressPlaqueFormsForm,
    FormValuesAddressPlaqueForms
} from "@/components/forms/address-plaque-forms-form";
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
                    image: ""
                }
            });
        }

        await prisma.addressPlaqueForm.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                image: ""
            }
        });
        redirect("/admin/address-plaque-form");
    };

    return (
        <div>
            <h1>{findAPF?.id ? `Форма адресного аншлага | ${findAPF.id}` : `Новая форма адресного аншлага | ${id}`}</h1>
            {findAPF ? (
                <AddressPlaqueFormsForm defaultValues={{ name: findAPF?.name }} onSubmit={handleSubmit} />
            ) : (
                <AddressPlaqueFormsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
