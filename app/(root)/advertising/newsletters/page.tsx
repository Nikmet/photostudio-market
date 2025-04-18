import { createProduct, creteProductItem } from "@/app/actions";
import { FormValuesNewsletters } from "@/components/admin-forms/newsletters-form/schema";
import { NewslettersClientForm } from "@/components/client-forms/newsletters-client-form";
import { PageTitle } from "@/components/page-title";
import { calcNewsletterPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function AddressPlaquesClientPage() {
    let id;

    const lastId = (
        await prisma.newsletter.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("ИВ", "1");
    } else {
        id = createUid("ИВ", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const colors = await prisma.color.findMany();

    const handleSubmit = async (data: FormValuesNewsletters, userId: string) => {
        "use server";

        const newsletter = await prisma.newsletter.create({
            data: {
                id: id,
                name: data.name,
                colorId: data.colorId,
                height: data.height,
                width: data.width
            }
        });

        const product = await createProduct(
            newsletter.id,
            newsletter.name,
            "Реклама",
            await calcNewsletterPrice(newsletter),
            "newsletters"
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
            <PageTitle>{`Новая информационная вывеска | ${id}`}</PageTitle>
            <NewslettersClientForm onSubmit={handleSubmit} id={id} colors={colors} />
        </div>
    );
}
