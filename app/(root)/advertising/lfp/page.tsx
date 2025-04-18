import { createProduct, creteProductItem, uploadImage } from "@/app/actions";
import { FormValuesLFP } from "@/components/admin-forms/lfp-form/schema";
import { LfpClientForm } from "@/components/client-forms/lfp-client-form";
import { PageTitle } from "@/components/page-title";
import { calcLFPPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function BannersClientPage() {
    let id;

    const lastId = (
        await prisma.lFP.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("ШФП", "1");
    } else {
        id = createUid("ШФП", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const paperTypes = await prisma.paperType.findMany();

    const handleSubmit = async (data: FormValuesLFP, userId: string) => {
        "use server";

        const lfp = await prisma.lFP.create({
            data: {
                id: id,
                name: data.name,
                height: data.height,
                width: data.width,
                paper_type_id: data.paper_type_id,
                printing_image: await uploadImage(data.printing_image)
            }
        });

        const product = await createProduct(lfp.id, lfp.name, "Реклама", await calcLFPPrice(lfp), "lfps");

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
            <PageTitle>{`Новая широкоформатная печать | ${id}`}</PageTitle>
            <LfpClientForm onSubmit={handleSubmit} id={id} paperTypes={paperTypes} />
        </div>
    );
}
