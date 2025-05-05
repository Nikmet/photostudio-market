import { createProduct, creteProductItem, uploadImage } from "@/app/actions";
import { FormValuesCups } from "@/components/admin-forms/cups-form/schema";
import { CupsClientForm } from "@/components/client-forms/cups-client-form";
import { PageTitle } from "@/components/page-title";
import { calcCupPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function CupsClientPage() {
    let id;

    const lastId = (
        await prisma.cup.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("К", "1");
    } else {
        id = createUid("К", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const handleSubmit = async (data: FormValuesCups, userId: string) => {
        "use server";

        const cup = await prisma.cup.create({
            data: {
                id: id,
                name: data.name,
                printing_image: await uploadImage(data.printing_image)
            }
        });

        const product = await createProduct(cup.id, cup.name, "Сувениры", await calcCupPrice(), "cups", data.comment);

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
            <PageTitle>{`Новая кружка | ${id}`}</PageTitle>
            <CupsClientForm onSubmit={handleSubmit} id={id} />
        </div>
    );
}
