import { createProduct, creteProductItem } from "@/app/actions";
import { FormValuesAddressPlaques } from "@/components/admin-forms/address-plaques-form/schema";
import { AddressPlaquesClientForm } from "@/components/client-forms/address-plaques-client-form";
import { PageTitle } from "@/components/page-title";
import { calcAddressPlaquePrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function BadgesClientPage() {
    let id;

    const lastId = (
        await prisma.addressPlaque.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("АА", "1");
    } else {
        id = createUid("АА", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const colors = await prisma.color.findMany();
    const forms = await prisma.addressPlaqueForm.findMany();

    const handleSubmit = async (data: FormValuesAddressPlaques, userId: string) => {
        "use server";

        const address_plaque = await prisma.addressPlaque.create({
            data: {
                id: id,
                name: data.name,
                address: data.address,
                colorId: data.colorId,
                formId: data.formId
            }
        });

        const product = await createProduct(
            address_plaque.id,
            address_plaque.name,
            "Реклама",
            await calcAddressPlaquePrice(address_plaque),
            "address-plaque"
        );

        if (!product) {
            throw new Error("Не удалось создать продукт");
        }

        const cart = creteProductItem(product, userId);

        if (!cart) {
            throw new Error("Не удалось создать продукт в корзине");
        }

        redirect("/");
    };

    return (
        <div>
            <PageTitle>{`Новый адресный аншлаг | ${id}`}</PageTitle>
            <AddressPlaquesClientForm onSubmit={handleSubmit} id={id} colors={colors} forms={forms} />
        </div>
    );
}
