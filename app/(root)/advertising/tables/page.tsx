import { createProduct, creteProductItem } from "@/app/actions";
import { FormValuesTables } from "@/components/admin-forms/tabels-form/schema";
import { TablesClientForm } from "@/components/client-forms/tables-client-form";
import { PageTitle } from "@/components/page-title";
import { calcTablePrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function AddressPlaquesClientPage() {
    let id;

    const lastId = (
        await prisma.table.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("Т", "1");
    } else {
        id = createUid("Т", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const colors = await prisma.color.findMany();

    const handleSubmit = async (data: FormValuesTables, userId: string) => {
        "use server";

        const table = await prisma.table.create({
            data: {
                id: id,
                name: data.name,
                colorId: data.colorId,
                height: data.height,
                width: data.width
            }
        });

        const product = await createProduct(table.id, table.name, "Реклама", await calcTablePrice(table), "tables");

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
            <PageTitle>{`Новая табличка | ${id}`}</PageTitle>
            <TablesClientForm onSubmit={handleSubmit} id={id} colors={colors} />
        </div>
    );
}
