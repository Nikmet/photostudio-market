import { createProduct, creteProductItem, uploadImage } from "@/app/actions";
import { FormValuesTShirts } from "@/components/admin-forms/t-shirts-form/schema";
import { TShirtsClientForm } from "@/components/client-forms/t-shirt-client-form";
import { PageTitle } from "@/components/page-title";
import { calcTShirtPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { PrintingSide, Size } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function CupsClientPage() {
    let id;

    const lastId = (
        await prisma.tShirt.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("Ф", "1");
    } else {
        id = createUid("Ф", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const handleSubmit = async (data: FormValuesTShirts, userId: string) => {
        "use server";

        const t_shirt = await prisma.tShirt.create({
            data: {
                id: id,
                name: data.name,
                printingSide: data.printingSide as PrintingSide,
                size: data.size as Size,
                printing_image: await uploadImage(data.printing_image)
            }
        });

        const product = await createProduct(
            t_shirt.id,
            t_shirt.name,
            "Сувениры",
            await calcTShirtPrice(t_shirt),
            "t-shirts",
            data.comment
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
            <PageTitle>{`Новая футболка | ${id}`}</PageTitle>
            <TShirtsClientForm onSubmit={handleSubmit} id={id} />
        </div>
    );
}
