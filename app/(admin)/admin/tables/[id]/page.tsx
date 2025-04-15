import { createProduct, updateProduct } from "@/app/actions";
import { FormValuesTables } from "@/components/admin-forms/tabels-form/schema";
import { TablesForm } from "@/components/admin-forms/tabels-form/tabels-form";
import { calcTablePrice } from "@/lib/prices";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function TablesEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findTable = await prisma.table.findFirst({
        where: {
            id: id
        },
        include: {
            Color: true
        }
    });

    const colors = await prisma.color.findMany();

    const handleSubmit = async (data: FormValuesTables) => {
        "use server";

        const findColor = await prisma.color.findFirst({
            where: {
                id: data.colorId
            }
        });

        if (!findTable) {
            const table = await prisma.table.create({
                data: {
                    id: id,
                    name: data.name,
                    width: data.width,
                    height: data.height,
                    Color: {
                        connect: {
                            id: findColor?.id
                        }
                    }
                }
            });

            await createProduct(table.id, table.name, "Реклама", await calcTablePrice(table), "tables");
        } else {
            const updatedTable = await prisma.table.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    width: data.width,
                    height: data.height,
                    Color: {
                        connect: {
                            id: findColor?.id
                        }
                    }
                }
            });
            await updateProduct(updatedTable.id, updatedTable.name, await calcTablePrice(updatedTable));
        }

        redirect("/admin/tables");
    };

    return (
        <div>
            <h1>{findTable?.id ? `Табличка | ${findTable.id}` : `Новая табличка | ${id}`}</h1>
            {findTable ? (
                <TablesForm defaultValues={findTable} onSubmit={handleSubmit} colors={colors} />
            ) : (
                <TablesForm colors={colors} onSubmit={handleSubmit} />
            )}
        </div>
    );
}
