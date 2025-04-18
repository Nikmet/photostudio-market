import { createProduct, creteProductItem } from "@/app/actions";
import { FormValuesFrames } from "@/components/admin-forms/frames-form/schema";
import { FramesClientForm } from "@/components/client-forms/frames-client-form";
import { PageTitle } from "@/components/page-title";
import { calcFramePrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function FramesClientPage() {
    let id;

    const lastId = (
        await prisma.frame.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("РМ", "1");
    } else {
        id = createUid("РМ", (Number(lastId.split("-")[1]) + 1).toString());
    }

    console.log(id);

    const baguettes = await prisma.baguette.findMany();

    const handleSubmit = async (data: FormValuesFrames, userId: string) => {
        "use server";

        const findBaguette = await prisma.baguette.findUnique({
            where: {
                id: data.baguetteId
            }
        });

        const frame = await prisma.frame.create({
            data: {
                id: id,
                name: data.name,
                height: data.height,
                width: data.width,
                has_backdrop: data.has_backdrop,
                has_glass: data.has_glass,
                has_suspension: data.has_suspension,
                baguetteId: data.baguetteId,
                image: findBaguette?.image
            }
        });

        const product = await createProduct(frame.id, frame.name, "Рамки", await calcFramePrice(frame), "frames");

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
            <PageTitle>{`Новая рамка | ${id}`}</PageTitle>
            <FramesClientForm onSubmit={handleSubmit} id={id} baguettes={baguettes} />
        </div>
    );
}
