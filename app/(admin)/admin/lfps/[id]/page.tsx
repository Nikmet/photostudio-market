import { createProduct } from "@/app/actions";
import { LfpForm } from "@/components/forms/lfp-form/lfp-form";
import { FormValuesLFP } from "@/components/forms/lfp-form/schema";
import { calcLFPPrice } from "@/lib/prices";
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

    const findLFP = await prisma.lFP.findFirst({
        where: {
            id: id
        },
        include: {
            paper_type: true
        }
    });

    const paperTypes = await prisma.paperType.findMany();

    const handleSubmit = async (data: FormValuesLFP) => {
        "use server";

        const findPaperType = await prisma.paperType.findFirst({
            where: {
                id: data.paper_type_id
            }
        });

        if (!findLFP) {
            const lfp = await prisma.lFP.create({
                data: {
                    id: id,
                    name: data.name,
                    width: data.width,
                    height: data.height,
                    paper_type: {
                        connect: {
                            id: findPaperType?.id
                        }
                    }
                }
            });

            await createProduct(lfp.id, lfp.name, "Реклама", await calcLFPPrice(lfp), "lfps");
        }

        await prisma.lFP.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                width: data.width,
                height: data.height,
                paper_type: {
                    connect: {
                        id: findPaperType?.id
                    }
                }
            }
        });
        redirect("/admin/lfps");
    };

    return (
        <div>
            <h1>{findLFP?.id ? `Широкоформатная печать | ${findLFP.id}` : `Новая широкоформатная печать | ${id}`}</h1>
            {findLFP ? (
                <LfpForm defaultValues={findLFP} onSubmit={handleSubmit} paperTypes={paperTypes} />
            ) : (
                <LfpForm onSubmit={handleSubmit} paperTypes={paperTypes} />
            )}
        </div>
    );
}
