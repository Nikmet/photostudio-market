import { createProduct } from "@/app/actions";
import { PrintingsForm } from "@/components/forms/printings-form/printings-form";
import { FormValuesPrintings } from "@/components/forms/printings-form/schema";
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

            await createProduct(printing.id, printing.name, "Сувениры", 450);
        }

        await prisma.printing.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                printing_type: data.printing_type as PrintingType
            }
        });
        redirect("/admin/printings");
    };

    return (
        <div>
            <h1>{findPrinting?.id ? `Печать | ${findPrinting.id}` : `Новая печать | ${id}`}</h1>
            {findPrinting ? (
                <PrintingsForm defaultValues={findPrinting} onSubmit={handleSubmit} />
            ) : (
                <PrintingsForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
