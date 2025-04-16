import { createProduct, creteProductItem, uploadImage } from "@/app/actions";
import { FormValuesBadges } from "@/components/admin-forms/badges-form/schema";
import { BadgesClientForm } from "@/components/client-forms/badges-client-form";
import { PageTitle } from "@/components/page-title";
import { calcBadgePrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function BadgesClientPage() {
    let id;

    const lastId = (
        await prisma.badge.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("ЗН", "1");
    } else {
        id = createUid("ЗН", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const handleSubmit = async (data: FormValuesBadges, userId: string) => {
        "use server";

        const badge = await prisma.badge.create({
            data: {
                id: id,
                name: data.name,
                printing_image: await uploadImage(data.printing_image)
            }
        });

        const product = await createProduct(badge.id, badge.name, "Сувениры", await calcBadgePrice(), "badges");

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
            <PageTitle>{`Новый значок | ${id}`}</PageTitle>
            <BadgesClientForm onSubmit={handleSubmit} id={id} />
        </div>
    );
}
