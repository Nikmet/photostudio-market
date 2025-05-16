import { createProduct, updateProduct } from "@/app/actions";
import { PrintingsForm } from "@/components/admin-forms/printings-form/printings-form";
import { FormValuesPrintings } from "@/components/admin-forms/printings-form/schema";
import { calcPrintingPrice } from "@/lib/prices";
import { prisma } from "@/prisma/prisma-client";
import { PrintingType } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PrintingsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findPrinting = await prisma.printing.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesPrintings) => {
        "use server";

        if (!findPrinting) {
            const printing = await prisma.printing.create({
                data: {
                    id: id,
                    name: data.name,
                    printing_type: data.printing_type as PrintingType
                }
            });

            await createProduct(printing.id, printing.name, "Сувениры", await calcPrintingPrice(printing), "printings");
        } else {
            const updatedPrinting = await prisma.printing.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    printing_type: data.printing_type as PrintingType
                }
            });
            await updateProduct(updatedPrinting.id, updatedPrinting.name, await calcPrintingPrice(updatedPrinting));
        }

        redirect("/admin/printings");
    };

    return (
        <div>
            <h1>{findPrinting?.id ? `Печать | ${findPrinting.id}` : `Новая печать | ${id}`}</h1>
            {findPrinting ? (
                <PrintingsForm defaultValues={findPrinting} onSubmit={handleSubmit} href="/admin/printings" id={id} />
            ) : (
                <PrintingsForm onSubmit={handleSubmit} href="/admin/printings" id={id} />
            )}
        </div>
    );
}
