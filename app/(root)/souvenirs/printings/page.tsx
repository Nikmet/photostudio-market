import { createProduct, creteProductItem } from "@/app/actions";
import { FormValuesPrintings } from "@/components/admin-forms/printings-form/schema";
import { PrintingsClientForm } from "@/components/client-forms/printings-client-form";
import { PageTitle } from "@/components/page-title";
import { calcPrintingPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { PrintingType } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function PrintingsClientPage() {
    let id;

    const lastId = (
        await prisma.printing.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("П", "1");
    } else {
        id = createUid("П", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const handleSubmit = async (data: FormValuesPrintings, userId: string) => {
        "use server";

        const printing = await prisma.printing.create({
            data: {
                id: id,
                name: data.name,
                printing_type: data.printing_type as PrintingType
            }
        });

        const product = await createProduct(
            printing.id,
            printing.name,
            "Сувениры",
            await calcPrintingPrice(printing),
            "printings"
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
            <PageTitle>{`Новая печать | ${id}`}</PageTitle>
            <PrintingsClientForm onSubmit={handleSubmit} id={id} />
        </div>
    );
}
