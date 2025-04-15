import { createProduct, updateProduct } from "@/app/actions";
import { LecForm } from "@/components/admin-forms/lec-form/lec-form";
import { FormValuesLEC } from "@/components/admin-forms/lec-form/schema";
import { calcLECPrice } from "@/lib/prices";
import { prisma } from "@/prisma/prisma-client";
import { Difficile } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PrintingsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findlEC = await prisma.lEC.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesLEC) => {
        "use server";

        if (!findlEC) {
            const lec = await prisma.lEC.create({
                data: {
                    id: id,
                    name: data.name,
                    height: data.height,
                    width: data.width,
                    difficile: data.difficile as Difficile
                }
            });

            await createProduct(lec.id, lec.name, "Сувениры", await calcLECPrice(lec), "lec");
        } else {
            const updatedLEC = await prisma.lEC.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    height: data.height,
                    width: data.width,
                    difficile: data.difficile as Difficile
                }
            });
            await updateProduct(updatedLEC.id, updatedLEC.name, await calcLECPrice(updatedLEC));
        }

        redirect("/admin/lec");
    };

    return (
        <div>
            <h1>{findlEC?.id ? `ЛГР | ${findlEC.id}` : `Новая ЛГР | ${id}`}</h1>
            {findlEC ? (
                <LecForm defaultValues={findlEC} onSubmit={handleSubmit} />
            ) : (
                <LecForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
