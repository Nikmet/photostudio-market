import { createProduct, creteProductItem, uploadImage } from "@/app/actions";
import { FormValuesMagnet } from "@/components/admin-forms/magnets-form/schema";
import { MagnetsClientForm } from "@/components/client-forms/magnet-client-form";
import { PageTitle } from "@/components/page-title";
import { calcMagnetPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { MagnetType } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function MagnetsClientPage() {
    let id;

    const lastId = (
        await prisma.magnet.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("МГ", "1");
    } else {
        id = createUid("МГ", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const handleSubmit = async (data: FormValuesMagnet, userId: string) => {
        "use server";

        const magnet = await prisma.magnet.create({
            data: {
                id: id,
                name: data.name,
                height: data.height,
                width: data.width,
                magnet_type: data.magnet_type as MagnetType,
                printing_image: await uploadImage(data.printing_image)
            }
        });

        const product = await createProduct(magnet.id, magnet.name, "Сувениры", await calcMagnetPrice(magnet), "cups");

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
            <MagnetsClientForm onSubmit={handleSubmit} id={id} />
        </div>
    );
}
