import { createProduct, creteProductItem, uploadImage } from "@/app/actions";
import { FormValuesBusinessCards } from "@/components/admin-forms/business-cards-form/schema";
import { BusinessCardsClientForm } from "@/components/client-forms/business-cards-client-form";
import { PageTitle } from "@/components/page-title";
import { calcBusinessCardPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { PrintingSide } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function BannersClientPage() {
    let id;

    const lastId = (
        await prisma.businessCard.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("В", "1");
    } else {
        id = createUid("В", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const handleSubmit = async (data: FormValuesBusinessCards, userId: string) => {
        "use server";

        const business_cards = await prisma.businessCard.create({
            data: {
                id: id,
                name: data.name,
                printing_side: data.printing_side as PrintingSide,
                printing_image: await uploadImage(data.printing_image)
            }
        });

        const product = await createProduct(
            business_cards.id,
            business_cards.name,
            "Реклама",
            await calcBusinessCardPrice(business_cards),
            "business_cards"
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
            <PageTitle>{`Новые визитки (100шт.) | ${id}`}</PageTitle>
            <BusinessCardsClientForm onSubmit={handleSubmit} id={id} />
        </div>
    );
}
