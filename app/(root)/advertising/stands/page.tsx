import { createProduct, creteProductItem, uploadImage } from "@/app/actions";
import { FormValuesStands } from "@/components/admin-forms/stands-form/schema";
import { StandsClientsForm } from "@/components/client-forms/stands-client-form";
import { PageTitle } from "@/components/page-title";
import { calcStandPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function StandsClientPage() {
    let id;

    const lastId = (
        await prisma.stand.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("СТ", "1");
    } else {
        id = createUid("СТ", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const handleSubmit = async (data: FormValuesStands, userId: string) => {
        "use server";

        const stand = await prisma.stand.create({
            data: {
                id: id,
                name: data.name,
                height: data.height,
                width: data.width,
                pocket_count: data.pocket_count,
                printing_image: await uploadImage(data.printing_image)
            }
        });

        const product = await createProduct(stand.id, stand.name, "Реклама", await calcStandPrice(stand), "stands");

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
            <PageTitle>{`Новый стенд | ${id}`}</PageTitle>
            <StandsClientsForm onSubmit={handleSubmit} id={id} />
        </div>
    );
}
