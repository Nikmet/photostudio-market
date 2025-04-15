import { PaperTypesForm } from "@/components/admin-forms/paper-types-form/paper-types-form";
import { FormValuesPaperTypes } from "@/components/admin-forms/paper-types-form/schema";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PaperTypesEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findPaperType = await prisma.paperType.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesPaperTypes) => {
        "use server";

        if (!findPaperType) {
            await prisma.paperType.create({
                data: {
                    id: id,
                    name: data.name,
                    price: data.price
                }
            });
        }

        await prisma.paperType.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                price: data.price
            }
        });
        redirect("/admin/paper-types");
    };

    return (
        <div>
            <h1>{findPaperType?.id ? `Тип бумаги | ${findPaperType.id}` : `Новый тип бумаги | ${id}`}</h1>
            {findPaperType ? (
                <PaperTypesForm defaultValues={findPaperType} onSubmit={handleSubmit} />
            ) : (
                <PaperTypesForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
