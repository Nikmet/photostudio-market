import { createProduct, updateProduct } from "@/app/actions";
import { NewslettersForm } from "@/components/admin-forms/newsletters-form/newsletters-form";
import { FormValuesNewsletters } from "@/components/admin-forms/newsletters-form/schema";
import { calcNewsletterPrice } from "@/lib/prices";
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

    const findNewsletter = await prisma.newsletter.findFirst({
        where: {
            id: id
        },
        include: {
            Color: true
        }
    });

    const colors = await prisma.color.findMany();

    const handleSubmit = async (data: FormValuesNewsletters) => {
        "use server";

        const findColor = await prisma.color.findFirst({
            where: {
                id: data.colorId
            }
        });

        if (!findNewsletter) {
            const newsletter = await prisma.newsletter.create({
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

            await createProduct(
                newsletter.id,
                newsletter.name,
                "Реклама",
                await calcNewsletterPrice(newsletter),
                "newsletters"
            );
        } else {
            await prisma.newsletter.update({
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
            await updateProduct(findNewsletter.id, findNewsletter.name, await calcNewsletterPrice(findNewsletter));
        }

        redirect("/admin/newsletters");
    };

    return (
        <div>
            <h1>
                {findNewsletter?.id
                    ? `Информационная табличка | ${findNewsletter.id}`
                    : `Новая информационная табличка | ${id}`}
            </h1>
            {findNewsletter ? (
                <NewslettersForm
                    onSubmit={handleSubmit}
                    defaultValues={findNewsletter}
                    colors={colors}
                    href="/admin/newsletters"
                    id={id}
                />
            ) : (
                <NewslettersForm onSubmit={handleSubmit} colors={colors} href="/admin/newsletters" id={id} />
            )}
        </div>
    );
}
